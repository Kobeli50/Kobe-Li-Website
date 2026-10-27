import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import cowSrc from "@/assets/cow.png";
import { socialLinks } from "@/lib/socialLinks";
import { createBodies, constrainBody, stepPhysics } from "@/lib/heroPhysics";
import type { Body, Bounds, CircleObstacle } from "@/lib/heroPhysics";
import "./HeroPlayground.css";

type InteractiveElement = HTMLAnchorElement | HTMLButtonElement;
type Drag = {
  id: string; pointerId: number; moved: boolean;
  startX: number; startY: number; x: number; y: number;
  lastX: number; lastY: number; time: number; vx: number; vy: number;
};
const ids = socialLinks.map(({ id }) => id);
const limitSpeed = (velocity: number) => Math.max(-90, Math.min(90, velocity));

const HeroPlayground = () => {
  const stage = useRef<HTMLDivElement>(null);
  const cowNode = useRef<HTMLButtonElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const bodies = useRef<Body[]>([]);
  const bounds = useRef<Bounds>({ width: 0, height: 0 });
  const iconBounds = useRef<Bounds>({ width: 0, height: 0 });
  const cow = useRef<CircleObstacle>({ x: 0, y: 0, radius: 0 });
  const cowSize = useRef(260);
  const radius = useRef(27);
  const drag = useRef<Drag | null>(null);
  const focus = useRef<string | undefined>();
  const suppressClick = useRef<string | null>(null);
  const visible = useRef(true);
  const pausedRef = useRef(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout>>();
  const instructions = useId();
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [dragged, setDragged] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [bounce, setBounce] = useState(0);
  pausedRef.current = paused;

  const draw = () => {
    for (const body of bodies.current) {
      const node = links.current.get(body.id);
      if (node) {
        node.style.transform = `translate3d(${body.x - body.radius}px, ${body.y - body.radius}px, 0)`;
        node.style.width = node.style.height = `${body.radius * 2}px`;
      }
    }
    if (cowNode.current) {
      cowNode.current.style.transform = `translate3d(${cow.current.x - cowSize.current / 2}px, ${cow.current.y - cowSize.current / 2}px, 0)`;
      cowNode.current.style.width = cowNode.current.style.height = `${cowSize.current}px`;
    }
  };

  const constrainCow = () => {
    const inset = cowSize.current / 2 + 8;
    cow.current.x = Math.max(inset, Math.min(bounds.current.width - inset, cow.current.x));
    cow.current.y = Math.max(inset, Math.min(bounds.current.height - inset, cow.current.y));
  };

  const arrange = () => {
    bodies.current = createBodies(ids, iconBounds.current, radius.current);
    cow.current = { x: bounds.current.width / 2, y: bounds.current.height * .72, radius: cowSize.current * .39 };
    constrainCow();
    draw();
  };

  useLayoutEffect(() => {
    let initialized = false;
    const measure = () => {
      if (!stage.current) return;
      const previous = bounds.current;
      const previousIcons = iconBounds.current;
      bounds.current = { width: stage.current.clientWidth, height: stage.current.clientHeight };
      iconBounds.current = { width: bounds.current.width, height: Math.min(195, bounds.current.height * .45) };
      radius.current = bounds.current.width < 380 ? 24 : 27;
      cowSize.current = Math.min(260, bounds.current.width * .61);
      if (!initialized) arrange();
      else {
        const scaleX = bounds.current.width / previous.width;
        const scaleY = bounds.current.height / previous.height;
        for (const body of bodies.current) {
          body.x *= scaleX;
          body.y *= iconBounds.current.height / previousIcons.height;
          body.radius = radius.current;
          constrainBody(body, iconBounds.current);
        }
        cow.current = { x: cow.current.x * scaleX, y: cow.current.y * scaleY, radius: cowSize.current * .39 };
        constrainCow();
        draw();
        if (drag.current) {
          const target = drag.current.id === "cow" ? cow.current : bodies.current.find(({ id }) => id === drag.current?.id);
          if (target) {
            drag.current.x = target.x; drag.current.y = target.y;
            drag.current.startX = drag.current.lastX; drag.current.startY = drag.current.lastY;
          }
        }
      }
      initialized = true;
      setReady(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(media.matches);
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    if (stage.current) observer.observe(stage.current);
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      const dt = previous ? Math.min((time - previous) / 1000, 1 / 30) : 0;
      previous = time;
      if (!pausedRef.current && visible.current && !document.hidden && bodies.current.length) {
        const held = drag.current?.id !== "cow" ? drag.current?.id ?? focus.current : undefined;
        // The solver subdivides each frame, keeping motion continuous at any refresh rate.
        stepPhysics(bodies.current, iconBounds.current, cow.current, dt, held);
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", sync);
      clearTimeout(feedbackTimer.current);
    };
  }, []);

  const announce = (text: string) => {
    clearTimeout(feedbackTimer.current);
    setGreeting(text);
    feedbackTimer.current = setTimeout(() => setGreeting(""), 1600);
  };

  const startDrag = (id: string, event: PointerEvent<InteractiveElement>) => {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    const target = id === "cow" ? cow.current : bodies.current.find((body) => body.id === id);
    if (!target) return;
    suppressClick.current = null;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, pointerId: event.pointerId, moved: false, startX: event.clientX, startY: event.clientY,
      x: target.x, y: target.y, lastX: event.clientX, lastY: event.clientY, time: event.timeStamp, vx: 0, vy: 0 };
  };

  const moveDrag = (event: PointerEvent<InteractiveElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    if (!active.moved && Math.hypot(dx, dy) < 6) return;
    active.moved = true;
    setDragged(active.id);
    event.preventDefault();
    const dt = Math.max(.008, (event.timeStamp - active.time) / 1000);
    active.vx = limitSpeed((event.clientX - active.lastX) / dt * .3);
    active.vy = limitSpeed((event.clientY - active.lastY) / dt * .3);
    active.lastX = event.clientX; active.lastY = event.clientY; active.time = event.timeStamp;
    if (active.id === "cow") {
      cow.current.x = active.x + dx; cow.current.y = active.y + dy;
      constrainCow();
    } else {
      const body = bodies.current.find(({ id }) => id === active.id)!;
      body.x = active.x + dx; body.y = active.y + dy;
      body.vx = active.vx; body.vy = active.vy;
      constrainBody(body, iconBounds.current);
    }
    draw();
  };

  const endDrag = (event: PointerEvent<InteractiveElement>) => {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const cancelled = event.type === "pointercancel" || event.type === "lostpointercapture";
    if (active.moved || cancelled) suppressClick.current = active.id;
    const body = bodies.current.find(({ id }) => id === active.id);
    if (body && active.moved) {
      const fresh = event.timeStamp - active.time < 100;
      body.vx = !cancelled && fresh ? active.vx : 0;
      body.vy = !cancelled && fresh ? active.vy : 0;
    }
    drag.current = null;
    focus.current = undefined;
    setDragged(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const wasDragged = (id: string, event: MouseEvent<InteractiveElement>) => {
    if (event.detail !== 0 && suppressClick.current === id) {
      event.preventDefault();
      suppressClick.current = null;
      return true;
    }
    suppressClick.current = null;
    return false;
  };

  const nudge = (id: string, event: KeyboardEvent<InteractiveElement>) => {
    if (id !== "cow") focus.current = id;
    if (event.repeat && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      return;
    }
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const target = id === "cow" ? cow.current : bodies.current.find((body) => body.id === id);
    if (!target) return;
    if (directions[event.key]) {
      event.preventDefault();
      const [dx, dy] = directions[event.key];
      const step = event.shiftKey ? 24 : 10;
      target.x += dx * step; target.y += dy * step;
      if (id === "cow") constrainCow(); else constrainBody(target as Body, iconBounds.current);
      draw();
    } else if (event.key === " " && id !== "cow") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="hero-playground" role="group" aria-label="Social links floating above a bouncing cow" data-paused={paused}>
      <div ref={stage} className="hero-playground__stage" data-ready={ready}>
        <button ref={cowNode} type="button" className="hero-playground__cow" data-dragging={dragged === "cow"}
          aria-label="Make the cow bounce" aria-describedby={instructions}
          onPointerDown={(event) => startDrag("cow", event)} onPointerMove={moveDrag} onPointerUp={endDrag}
          onPointerCancel={endDrag} onLostPointerCapture={endDrag} onKeyDown={(event) => nudge("cow", event)}
          onClick={(event) => {
            if (wasDragged("cow", event)) return;
            setBounce((value) => value + 1);
            announce("moo!");
            if (!pausedRef.current) for (const body of bodies.current) {
              body.vx = limitSpeed(body.vx + (body.x < cow.current.x ? -1 : 1) * 8);
              body.vy = -35;
            }
          }}>
          <span key={bounce} className="hero-playground__cow-response" data-bounce={bounce > 0}>
            <img src={cowSrc} alt="" draggable={false} width={1024} height={1024} />
          </span>
          {greeting === "moo!" && <span className="hero-playground__bubble" aria-hidden="true">moo!</span>}
        </button>
        {socialLinks.map(({ id, label, href, icon: Icon }) => (
          <a key={id} ref={(node) => { if (node) links.current.set(id, node); else links.current.delete(id); }}
            href={href} target="_blank" rel="noopener noreferrer" draggable={false}
            className="hero-playground__social" data-social={id} data-dragging={dragged === id}
            aria-label={`${label} (opens in a new tab)`} aria-describedby={instructions}
            onFocus={() => { focus.current = id; }} onBlur={() => { if (focus.current === id) focus.current = undefined; }}
            onPointerDown={(event) => startDrag(id, event)} onPointerMove={moveDrag} onPointerUp={endDrag}
            onPointerCancel={endDrag} onLostPointerCapture={endDrag} onClick={(event) => { wasDragged(id, event); }}
            onKeyDown={(event) => nudge(id, event)} onDragStart={(event) => event.preventDefault()}>
            <Icon aria-hidden="true" className="hero-playground__social-icon" />
            <span className="hero-playground__label" aria-hidden="true">{label}</span>
          </a>
        ))}
      </div>
      <p id={instructions} className="sr-only">Enter or Space opens a social profile. Drag or use the arrow keys to move a focused icon or the cow.</p>
      <span className="sr-only" role="status" aria-live="polite">{greeting}</span>
    </div>
  );
};

export default HeroPlayground;
