import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const AIDataNetwork: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.getElapsedTime() * 0.08;
    }
  });

  const nodePositions: [number, number, number][] = [
    [1.8, 1.2, 0.5],
    [-1.6, -1.0, 1.2],
    [2.0, -0.8, -1.0],
    [-1.8, 1.5, -0.8],
    [0, 2.2, 1.0],
    [0, -2.2, -1.0],
  ];

  return (
    <group ref={groupRef}>
      {nodePositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Glowing Node Sphere */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1} />
          </mesh>
          {/* Orbiting Ring */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.22, 0.015, 12, 24]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Wireframe Connecting Ring */}
      <mesh>
        <torusGeometry args={[2.2, 0.01, 16, 64]} />
        <meshBasicMaterial color="#36a9f7" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
      </mesh>
    </group>
  );
};
