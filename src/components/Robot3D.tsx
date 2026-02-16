import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ─── TARS from Interstellar ───────────────────────────────────────────────────
// 4 flat rectangular slabs side-by-side forming a monolith.
// Walks by splitting into two pairs that cartwheel 180° over each other,
// pivoting at the top hinge where the pairs meet.
// ──────────────────────────────────────────────────────────────────────────────

const SLAB_W = 0.17;
const SLAB_H = 1.4;
const SLAB_D = 0.17;
const GAP = 0.005;           // gap between slabs within a pair
const PAIR_GAP = 0.008;      // gap between the two pairs
const PAIR_CX = SLAB_W / 2 + GAP / 2; // half-span within a pair
const HALF_BODY = PAIR_CX + PAIR_GAP / 2; // half total body width at the pair seam
const STEP_TIME = 1.05;      // seconds per step
const BOUNDS = 5;

// Gravity-inspired easing: tips slowly at first, accelerates, decelerates on landing
const tipEase = (t: number): number => {
  // Quadratic ease-in for first 20%, linear middle, quadratic ease-out last 20%
  if (t < 0.2) {
    const n = t / 0.2;
    return 0.2 * n * n;
  }
  if (t > 0.8) {
    const n = (t - 0.8) / 0.2;
    return 0.8 + 0.2 * (1 - (1 - n) * (1 - n));
  }
  return t;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const Seam = ({ y }: { y: number }) => (
  <mesh position={[0, y, SLAB_D / 2 + 0.001]}>
    <planeGeometry args={[SLAB_W * 0.88, 0.005]} />
    <meshBasicMaterial color="#3d3d3d" />
  </mesh>
);

const Slab = ({ color, x }: { color: string; x: number }) => (
  <group position={[x, 0, 0]}>
    <RoundedBox args={[SLAB_W, SLAB_H, SLAB_D]} radius={0.005} smoothness={2}>
      <meshStandardMaterial color={color} metalness={0.72} roughness={0.52} />
    </RoundedBox>
    <Seam y={SLAB_H * 0.25} />
    <Seam y={0} />
    <Seam y={-SLAB_H * 0.25} />
    {/* Back face seams too */}
    <mesh position={[0, SLAB_H * 0.25, -SLAB_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[SLAB_W * 0.88, 0.005]} />
      <meshBasicMaterial color="#3d3d3d" />
    </mesh>
    <mesh position={[0, 0, -SLAB_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[SLAB_W * 0.88, 0.005]} />
      <meshBasicMaterial color="#3d3d3d" />
    </mesh>
    <mesh position={[0, -SLAB_H * 0.25, -SLAB_D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[SLAB_W * 0.88, 0.005]} />
      <meshBasicMaterial color="#3d3d3d" />
    </mesh>
  </group>
);

// ─── TARS Component ──────────────────────────────────────────────────────────
//
// Walk mechanics:
//   Two pairs (A left, B right) take turns cartwheeling over each other.
//   The pivot is at the TOP of the stance pair, at the inner edge.
//   
//   Instead of fighting with fixed JSX child offsets, we directly compute
//   the world positions of each pair every frame using polar math.
//   
//   For the STANCE pair: trivially placed with bottom at y=0.
//   For the SWING pair: its center orbits around the pivot point.
//     - Start position: beside stance, on the ground.
//     - End position: on the other side of stance, on the ground.
//     - Path: a semicircle (180°) around the pivot.

const TARS = () => {
  const pairARef = useRef<THREE.Group>(null);
  const pairBRef = useRef<THREE.Group>(null);

  const st = useRef({
    time: 0,
    step: 0,
    dir: 1 as 1 | -1,
    // Track world X of each pair's ground center
    axA: -HALF_BODY,
    axB: HALF_BODY,
  });

  useFrame((_, dt) => {
    const a = pairARef.current;
    const b = pairBRef.current;
    if (!a || !b) return;

    const s = st.current;
    s.time += dt;

    const t = Math.min(s.time / STEP_TIME, 1);
    const eased = tipEase(t);

    // Which pair swings this step?
    // When moving right (dir=1): the LEFT (rear) pair swings over the right (front).
    // When moving left (dir=-1): the RIGHT (rear) pair swings over the left (front).
    const aIsRear = (s.dir === 1 && s.axA < s.axB) || (s.dir === -1 && s.axA > s.axB);
    const swingRef = aIsRear ? a : b;
    const stanceRef = aIsRear ? b : a;
    const stanceX = aIsRear ? s.axB : s.axA;
    const swingX = aIsRear ? s.axA : s.axB;

    // ── Stance pair: flat on ground ──
    stanceRef.position.set(stanceX, SLAB_H / 2, 0);
    stanceRef.rotation.z = 0;

    // ── Swing pair: orbiting around pivot ──
    // Pivot = top center of stance = (stanceX, SLAB_H)
    // Swing slab center relative to pivot at rest: (swingX - stanceX, -SLAB_H/2)
    const dx = swingX - stanceX;
    const radius = Math.sqrt(dx * dx + (SLAB_H / 2) * (SLAB_H / 2));

    // Angle of start position from the -Y axis (measuring CCW positive)
    // atan2(x, y_down) where y_down points in -Y direction
    const startAng = Math.atan2(dx, SLAB_H / 2);
    // End angle: mirror on the other side = -startAng
    // Total sweep = 2 * |startAng|, direction = toward -startAng
    const sweepDir = dx > 0 ? 1 : -1; // CCW if swing is to the right, CW if left
    const totalSweep = 2 * Math.abs(startAng);
    const currentAng = startAng + sweepDir * totalSweep * eased;

    // Convert angle back to offset from pivot
    // angle is measured from -Y axis, CCW positive:
    //   offset_x = radius * sin(currentAng)
    //   offset_y = -radius * cos(currentAng)
    const offX = radius * Math.sin(currentAng);
    const offY = -radius * Math.cos(currentAng);

    // World position of slab center
    swingRef.position.set(stanceX + offX, SLAB_H + offY, 0);
    // Rotation: the slab should rotate so it stays tangent to the arc
    // At start, rotation = 0 (upright). At end, rotation = 0 (upright on other side).
    // Through the arc, it rotates by the sweep angle.
    swingRef.rotation.z = sweepDir * totalSweep * eased;

    // ── Step complete ──
    if (t >= 1) {
      // Landed position: end angle = -startAng
      const endOffX = radius * Math.sin(-startAng);
      const landedX = stanceX + endOffX;

      if (aIsRear) {
        s.axA = landedX;
      } else {
        s.axB = landedX;
      }

      // Boundary check
      const center = (s.axA + s.axB) / 2;
      if (center > BOUNDS) s.dir = -1;
      if (center < -BOUNDS) s.dir = 1;

      s.time = 0;
      s.step++;
    }
  });

  return (
    <group>
      {/* Pair A (slabs 0-1) */}
      <group ref={pairARef}>
        <Slab color="#7a7a7a" x={-PAIR_CX} />
        <Slab color="#828282" x={PAIR_CX} />
        {/* Crimson LED slit on pair A */}
        <mesh position={[0, SLAB_H * 0.37, SLAB_D / 2 + 0.002]}>
          <planeGeometry args={[SLAB_W * 1.2, 0.01]} />
          <meshStandardMaterial color="#C8102E" emissive="#C8102E" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* Pair B (slabs 2-3) */}
      <group ref={pairBRef}>
        <Slab color="#848484" x={-PAIR_CX} />
        <Slab color="#7c7c7c" x={PAIR_CX} />
      </group>
    </group>
  );
};

// ─── Scene ───────────────────────────────────────────────────────────────────

export const RobotScene = () => (
  <div style={{ width: '100%', height: '100vh', background: '#050505', position: 'relative' }}>
    <Canvas camera={{ position: [0, 1.0, 5], fov: 50 }} shadows>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#C8102E" />
      <pointLight position={[0, 2, 3]} intensity={0.15} color="#ff4444" />

      <TARS />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#080808" metalness={0.3} roughness={0.8} />
      </mesh>
      <gridHelper args={[50, 50, '#C8102E', '#131313']} position={[0, 0.001, 0]} />
    </Canvas>

    {/* Overlay UI */}
    <div
      style={{
        position: 'absolute',
        top: 28,
        left: 28,
        color: '#fff',
        fontFamily: '"JetBrains Mono", monospace',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6 }}>
        <span style={{ color: '#C8102E' }}>TARS</span>
      </div>
      <div style={{ fontSize: 11, color: '#555', marginTop: 4, letterSpacing: 2 }}>
        INTERSTELLAR TACTICAL ROBOT
      </div>
    </div>
  </div>
);

export default RobotScene;
