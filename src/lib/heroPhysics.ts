/** Small, deterministic circle simulation for the interactive homepage. Units: pixels and seconds. */
export type Body = { id: string; x: number; y: number; vx: number; vy: number; radius: number };
export type Bounds = { width: number; height: number };
export type CircleObstacle = { x: number; y: number; radius: number };

const GRAVITY = 18;
const RESTITUTION = 0.88;
const FLOOR_LAUNCH = 45;
const MAX_SPEED = 100;
const AIR_DRAG = 0.12;
const CRUISE_SPEED = 12;
const SOLVER_PASSES = 6;
const EPSILON = 0.0001;

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback;
const dimension = (value: number) => Math.max(1, finite(value, 1));
const radiusOf = (body: Body) => Math.max(1, finite(body.radius, 24));

const seedAngle = (id: string) => {
  let hash = 0;
  for (let index = 0; index < id.length; index++) hash = ((hash << 5) - hash + id.charCodeAt(index)) | 0;
  return (Math.abs(hash) % 360) * Math.PI / 180;
};

/** Keep a body finite and inside the stage; reflect only velocity pointing into a wall. */
export const constrainBody = (body: Body, bounds: Bounds): void => {
  const width = dimension(bounds.width);
  const height = dimension(bounds.height);
  const radius = radiusOf(body);
  body.radius = radius;
  body.x = finite(body.x, width / 2);
  body.y = finite(body.y, Math.min(height / 2, radius + 16));
  body.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, finite(body.vx, 0)));
  body.vy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, finite(body.vy, 0)));

  if (width <= radius * 2) {
    body.x = width / 2;
    body.vx = 0;
  } else if (body.x < radius) {
    body.x = radius;
    if (body.vx < 0) body.vx = -body.vx * RESTITUTION;
  } else if (body.x > width - radius) {
    body.x = width - radius;
    if (body.vx > 0) body.vx = -body.vx * RESTITUTION;
  }

  if (height <= radius * 2) {
    body.y = height / 2;
    body.vy = 0;
  } else if (body.y < radius) {
    body.y = radius;
    if (body.vy < 0) body.vy = -body.vy * RESTITUTION;
  } else if (body.y > height - radius) {
    body.y = height - radius;
    if (body.vy > 0) body.vy = -Math.max(FLOOR_LAUNCH, body.vy * RESTITUTION);
  }
};

export const createBodies = (ids: string[], bounds: Bounds, radius: number): Body[] => {
  const width = dimension(bounds.width);
  const safeRadius = Math.max(1, finite(radius, 24));
  const margin = safeRadius + 14;
  const columns = Math.max(1, Math.min(ids.length, Math.floor((width - 28) / (safeRadius * 2 + 8))));
  const heightOffsets = [0, 14, 4, 20, 9, 26];
  const verticalSpeeds = [-4, 3, -2, 5, -5, 1];
  return ids.map((id, index) => {
    const column = index % columns;
    const body: Body = {
      id,
      radius: safeRadius,
      x: columns === 1 ? width / 2 : margin + column * Math.max(0, width - margin * 2) / (columns - 1),
      y: margin + Math.floor(index / columns) * (safeRadius * 2 + 14) + heightOffsets[index % heightOffsets.length],
      vx: (index % 2 ? -1 : 1) * (7 + (index % 3) * 2.5),
      vy: verticalSpeeds[index % verticalSpeeds.length],
    };
    constrainBody(body, bounds);
    return body;
  });
};

const collidePair = (a: Body, b: Body, heldId?: string): void => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const minimumDistance = a.radius + b.radius;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared >= minimumDistance * minimumDistance) return;

  const distance = Math.sqrt(distanceSquared);
  const angle = seedAngle(`${a.id}/${b.id}`);
  const nx = distance > EPSILON ? dx / distance : Math.cos(angle);
  const ny = distance > EPSILON ? dy / distance : Math.sin(angle);
  const inverseA = a.id === heldId ? 0 : 1;
  const inverseB = b.id === heldId ? 0 : 1;
  const inverseSum = inverseA + inverseB;
  if (!inverseSum) return;

  const correction = (minimumDistance - distance + EPSILON) / inverseSum;
  a.x -= nx * correction * inverseA;
  a.y -= ny * correction * inverseA;
  b.x += nx * correction * inverseB;
  b.y += ny * correction * inverseB;

  // A held icon behaves as a fixed obstacle without discarding its stored release velocity.
  const relativeSpeed = ((inverseB ? b.vx : 0) - (inverseA ? a.vx : 0)) * nx
    + ((inverseB ? b.vy : 0) - (inverseA ? a.vy : 0)) * ny;
  if (relativeSpeed >= 0) return;
  const impulse = -(1 + RESTITUTION) * relativeSpeed / inverseSum;
  a.vx -= impulse * nx * inverseA;
  a.vy -= impulse * ny * inverseA;
  b.vx += impulse * nx * inverseB;
  b.vy += impulse * ny * inverseB;
};

const collideCow = (body: Body, cow: CircleObstacle, bounds: Bounds): void => {
  if (!(cow.radius > 0) || !Number.isFinite(cow.radius) || !Number.isFinite(cow.x) || !Number.isFinite(cow.y)) return;
  const dx = body.x - cow.x;
  const dy = body.y - cow.y;
  const distance = Math.hypot(dx, dy);
  const minimumDistance = body.radius + cow.radius;
  if (distance >= minimumDistance) return;
  const angle = seedAngle(body.id);
  let nx = distance > EPSILON ? dx / distance : Math.cos(angle);
  let ny = distance > EPSILON ? dy / distance : Math.sin(angle);
  const separation = minimumDistance + EPSILON;
  let nextX = cow.x + nx * separation;
  let nextY = cow.y + ny * separation;
  const left = body.radius;
  const right = dimension(bounds.width) - body.radius;
  const top = body.radius;
  const bottom = dimension(bounds.height) - body.radius;

  // A moving cow can close the gap beside a wall. Choose the nearest reachable
  // circle/wall intersection instead of repeatedly pushing the icon through it.
  if (left <= right && top <= bottom && (nextX < left || nextX > right || nextY < top || nextY > bottom)) {
    const candidates: { x: number; y: number }[] = [];
    const add = (x: number, y: number) => {
      if (x >= left - EPSILON && x <= right + EPSILON && y >= top - EPSILON && y <= bottom + EPSILON) candidates.push({ x, y });
    };
    for (const x of [left, right]) {
      const remainder = separation ** 2 - (x - cow.x) ** 2;
      if (remainder >= 0) {
        const offset = Math.sqrt(remainder);
        add(x, cow.y - offset);
        add(x, cow.y + offset);
      }
    }
    for (const y of [top, bottom]) {
      const remainder = separation ** 2 - (y - cow.y) ** 2;
      if (remainder >= 0) {
        const offset = Math.sqrt(remainder);
        add(cow.x - offset, y);
        add(cow.x + offset, y);
      }
    }
    candidates.sort((a, b) => Math.hypot(a.x - body.x, a.y - body.y) - Math.hypot(b.x - body.x, b.y - body.y));
    if (candidates.length) {
      nextX = candidates[0].x;
      nextY = candidates[0].y;
      nx = (nextX - cow.x) / separation;
      ny = (nextY - cow.y) / separation;
    }
  }
  body.x = nextX;
  body.y = nextY;
  const incomingSpeed = body.vx * nx + body.vy * ny;
  if (incomingSpeed < 0) {
    body.vx -= (1 + RESTITUTION) * incomingSpeed * nx;
    body.vy -= (1 + RESTITUTION) * incomingSpeed * ny;
  }
};

/**
 * Advance in place. dt is seconds; long/background frames are capped to 50ms.
 * Integration substeps are at most 1/120s and shrink for unusually small circles.
 * heldId skips integration and obstacle correction but still pushes neighboring icons.
 */
export const stepPhysics = (
  bodies: Body[],
  bounds: Bounds,
  cow: CircleObstacle,
  dt: number,
  heldId?: string,
): void => {
  for (const body of bodies) constrainBody(body, bounds);
  const elapsed = Math.max(0, Math.min(0.05, finite(dt, 0)));
  if (!elapsed || !bodies.length) return;
  const smallestRadius = Math.min(...bodies.map((body) => body.radius));
  const maxStep = Math.min(1 / 120, smallestRadius / (MAX_SPEED * 2));
  const steps = Math.ceil(elapsed / maxStep);
  const step = elapsed / steps;
  const damping = Math.exp(-AIR_DRAG * step);

  for (let tick = 0; tick < steps; tick++) {
    for (const body of bodies) {
      if (body.id === heldId) continue;
      // Let slow lateral drift continue; only dissipate the excess speed of a toss.
      if (Math.abs(body.vx) > CRUISE_SPEED) {
        body.vx = Math.sign(body.vx) * (CRUISE_SPEED + (Math.abs(body.vx) - CRUISE_SPEED) * damping);
      }
      body.vy = Math.min(MAX_SPEED, body.vy * damping + GRAVITY * step);
      body.x += body.vx * step;
      body.y += body.vy * step;
      constrainBody(body, bounds);
    }

    for (let pass = 0; pass < SOLVER_PASSES; pass++) {
      for (const body of bodies) if (body.id !== heldId) collideCow(body, cow, bounds);
      for (let index = 0; index < bodies.length; index++) {
        for (let other = index + 1; other < bodies.length; other++) collidePair(bodies[index], bodies[other], heldId);
      }
      for (const body of bodies) constrainBody(body, bounds);
    }
  }
};
