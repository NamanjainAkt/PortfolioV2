To bring your "Walker" robot to life on the web using React and React Three Fiber (R3F), you need to move away from complex skeletal rigging and use **Procedural Animation**. This involves mathematically driving the rotation of separate body parts directly in your code.

Here is your full guide to splitting the model in Blender and animating it in React.

---

### Phase 1: Preparation in Blender

You must separate the mesh so React can grab each limb individually.

1. **Split the Mesh:**
* Open your model in Blender.
* Enter **Edit Mode** (`Tab`).
* Select all vertices belonging to the **Left Leg**. Press `P`  **Selection**.
* Repeat for the **Right Leg** and **Head/Body**.
* *Result:* You should now have 3 separate objects in your Scene Collection.


2. **Fix the Pivot Points (Crucial):**
* If you rotate a leg now, it will likely spin around its center. You want it to swing from the **hip**.
* Select the **Left Leg**.
* Move the 3D Cursor to where the leg connects to the body (Shift + Right Click).
* Go to **Object**  **Set Origin**  **Origin to 3D Cursor**.
* Repeat for the Right Leg (origin at hip) and Head (origin at neck).


3. **Naming:**
* Rename your objects clearly in the Outliner (e.g., `Head`, `LegL`, `LegR`). These names become keys in React.


4. **Export:**
* Select all 3 objects.
* File  Export  **glTF 2.0 (.glb)**.
* Check "Selected Objects" and under Transform, check "+Y Up".



---

### Phase 2: The React Implementation

We will use `react-three-fiber` to handle the 3D scene and `drei` to load the model easily.

**Prerequisites:**

```bash
npm install three @types/three @react-three/fiber @react-three/drei

```

**The Code (`Robot.jsx`):**
This component loads your model and uses `useFrame` to update rotations 60 times a second.

```jsx
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function RobotModel(props) {
  // 1. Load the GLB model
  // Make sure to put 'robot.glb' in your public folder
  const { nodes, materials } = useGLTF("/robot.glb");

  // 2. Create references for the parts we want to animate
  const headRef = useRef();
  const legLRef = useRef();
  const legRRef = useRef();
  const groupRef = useRef();

  // State for movement logic
  // In a real app, bind these to keyboard events (WASD)
  const [movement, setMovement] = useState({ forward: false, backward: false });

  // 3. The Animation Loop (Runs 60fps)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouse = state.mouse; // x and y are normalized (-1 to 1)

    // --- LOOK AROUND MOTION ---
    // Smoothly interpolate head rotation towards mouse position
    if (headRef.current) {
      // Look Left/Right (Y axis)
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mouse.x * 0.8, // 0.8 limits the neck turn angle
        0.1 // Smoothing factor
      );
      // Look Up/Down (X axis)
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -mouse.y * 0.5, 
        0.1
      );
    }

    // --- WALKING MOTION ---
    // We use a Sine wave: Math.sin(time * speed)
    const walkSpeed = 10;
    const stride = 0.5; // How far legs swing

    if (movement.forward || movement.backward) {
        // Animate Legs
        // Left Leg: Normal Sine wave
        legLRef.current.rotation.x = Math.sin(t * walkSpeed) * stride;
        
        // Right Leg: Offset by PI (so it moves opposite to Left)
        legRRef.current.rotation.x = Math.sin(t * walkSpeed + Math.PI) * stride;

        // Move the whole robot group
        const direction = movement.forward ? 1 : -1;
        const moveSpeed = 0.05;
        groupRef.current.position.z += direction * moveSpeed;
        
        // Add a little "Bob" to the head/body for realism
        headRef.current.position.y = Math.sin(t * walkSpeed * 2) * 0.05; 
    } else {
        // Return to idle pose smoothly if not moving
        legLRef.current.rotation.x = THREE.MathUtils.lerp(legLRef.current.rotation.x, 0, 0.1);
        legRRef.current.rotation.x = THREE.MathUtils.lerp(legRRef.current.rotation.x, 0, 0.1);
    }
  });

  // Keyboard controls listener (Simple version)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
        if(e.key === 'w') setMovement(m => ({...m, forward: true}));
        if(e.key === 's') setMovement(m => ({...m, backward: true}));
    };
    const handleKeyUp = (e) => {
        if(e.key === 'w') setMovement(m => ({...m, forward: false}));
        if(e.key === 's') setMovement(m => ({...m, backward: false}));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* IMPORTANT: Use the node names exactly as they appear in Blender.
        Console.log(nodes) to verify names if it crashes.
      */}
      <mesh
        ref={headRef}
        geometry={nodes.Head.geometry}
        material={materials.MainMaterial} // Or whatever your material is named
      />
      <mesh
        ref={legLRef}
        geometry={nodes.LegL.geometry}
        material={materials.MainMaterial}
      />
      <mesh
        ref={legRRef}
        geometry={nodes.LegR.geometry}
        material={materials.MainMaterial}
      />
    </group>
  );
}

// 4. The Main App Component
export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RobotModel />
        <OrbitControls />
        <gridHelper />
      </Canvas>
    </div>
  );
}

```

