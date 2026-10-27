import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/lib/heroPhysics.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { createBodies, stepPhysics, constrainBody } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const bounds = { width: 600, height: 500 };
const noCow = { x: 0, y: 0, radius: 0 };
const body = (id, x, y, vx = 0, vy = 0) => ({ id, x, y, vx, vy, radius: 25 });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const inside = (item, box) => {
  for (const value of Object.values(item).filter((value) => typeof value === 'number')) assert.ok(Number.isFinite(value));
  assert.ok(item.x >= item.radius - .001 && item.x <= box.width - item.radius + .001);
  assert.ok(item.y >= item.radius - .001 && item.y <= box.height - item.radius + .001);
};

// Equal-mass impact preserves horizontal momentum and loses kinetic energy.
const pair = [body('a', 179, 100, 20), body('b', 221, 100, -20)];
stepPhysics(pair, bounds, noCow, 1 / 120);
assert.ok(distance(...pair) >= 50 - .001);
assert.ok(Math.abs(pair[0].vx + pair[1].vx) < .001);
assert.ok(pair[0].vx < 0 && pair[1].vx > 0);
assert.ok(pair.reduce((sum, item) => sum + item.vx ** 2, 0) < 2 * 20 ** 2);

// Walls contain outward throws, while the floor gives a gentle rebound.
const wall = body('wall', 26, 100, -50);
stepPhysics([wall], bounds, noCow, 1 / 30);
inside(wall, bounds);
assert.ok(wall.vx > 0);
const floor = body('floor', 200, 474.5, 0, 30);
stepPhysics([floor], bounds, noCow, 1 / 30);
inside(floor, bounds);
assert.ok(floor.vy < 0);

// The cow is solid and reflects an incoming icon.
const cow = { x: 300, y: 250, radius: 80 };
const incoming = body('incoming', 194.5, 250, 90);
stepPhysics([incoming], bounds, cow, 1 / 120);
assert.ok(distance(incoming, cow) >= incoming.radius + cow.radius - .001);
assert.ok(incoming.vx < 0);

// Dragging the cow against a wall must not leave an icon trapped in the gap.
const nearWall = { x: 100, y: 180, radius: 85 };
const trapped = { ...body('trapped', 23, 180), radius: 23 };
const narrowBounds = { width: 280, height: 380 };
stepPhysics([trapped], narrowBounds, nearWall, 1 / 120);
inside(trapped, narrowBounds);
assert.ok(distance(trapped, nearWall) >= trapped.radius + nearWall.radius - .001);

// A held icon remains fixed while another icon is separated and reflected.
const held = body('held', 200, 100);
const neighbor = body('neighbor', 241, 100, -20);
stepPhysics([held, neighbor], bounds, noCow, 1 / 120, 'held');
assert.equal(held.x, 200);
assert.equal(held.y, 100);
assert.ok(distance(held, neighbor) >= 50 - .001);
assert.ok(neighbor.vx > 0);

// Resize clamps, and corrupted numeric state recovers without spreading NaNs.
const resize = body('resize', 590, 490, 100, 100);
constrainBody(resize, { width: 280, height: 380 });
inside(resize, { width: 280, height: 380 });
const invalid = body('invalid', NaN, Infinity, NaN, -Infinity);
stepPhysics([invalid], bounds, cow, 1 / 60);
inside(invalid, bounds);

// Tosses lose speed gradually instead of snapping to a stop.
const tossed = body('tossed', 150, 100, 90);
stepPhysics([tossed], bounds, noCow, 1 / 60);
assert.ok(tossed.vx < 90 && tossed.vx > 89);
for (let frame = 0; frame < 120; frame++) stepPhysics([tossed], bounds, noCow, 1 / 120);
assert.ok(tossed.vx < 82 && tossed.vx > 70);

// Slow cruising motion remains steady without forced minimums or direction changes.
for (const velocity of [0, 7, -9.5, 12]) {
  const cruising = body('cruising', 300, 100, velocity);
  for (let frame = 0; frame < 120; frame++) stepPhysics([cruising], bounds, noCow, 1 / 120);
  assert.equal(cruising.vx, velocity);
}

// Six icons stay calm, bounded, and separated in the actual shallow floating bands.
for (const box of [{ width: 280, height: 180 }, { width: 520, height: 195 }]) {
  const obstacle = { x: box.width / 2, y: box.height + 110, radius: box.width < 300 ? 85 : 100 };
  const bodies = createBodies(['linkedin', 'instagram', 'goodreads', 'substack', 'x', 'github'], box, box.width < 300 ? 23 : 25);
  assert.ok(bodies.every((item) => Math.abs(item.vx) >= 7 && Math.abs(item.vx) <= 12));
  assert.ok(new Set(bodies.map((item) => item.y)).size > 3);
  assert.ok(new Set(bodies.map((item) => item.vy)).size > 3);
  for (let frame = 0; frame < 3600; frame++) {
    stepPhysics(bodies, box, obstacle, 1 / 120);
    for (const item of bodies) {
      inside(item, box);
      assert.ok(Math.abs(item.vx) <= 100 && Math.abs(item.vy) <= 100);
    }
    if (frame % 120 === 0) {
      for (let i = 0; i < bodies.length; i++) {
        assert.ok(distance(bodies[i], obstacle) >= bodies[i].radius + obstacle.radius - .5);
        for (let j = i + 1; j < bodies.length; j++) assert.ok(distance(bodies[i], bodies[j]) >= bodies[i].radius + bodies[j].radius - .5);
      }
    }
  }
}
console.log('Hero physics: collisions, wall/cow/held handling, recovery, resize, toss damping, steady cruise, staggered phases, and 30-second shallow-band stability checks passed.');
