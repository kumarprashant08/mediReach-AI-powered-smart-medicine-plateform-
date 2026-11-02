import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CapsuleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  colorTop?: string;
  colorBottom?: string;
}

export const MedicineCapsule: React.FC<CapsuleProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0.4],
  scale = 1,
  colorTop = '#0c8de9',
  colorBottom = '#ffffff',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle float oscillation
      groupRef.current.position.y = initialY + Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.15;
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Top Half of Capsule */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color={colorTop} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colorTop} roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Bottom Half of Capsule */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color={colorBottom} roughness={0.1} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colorBottom} roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Middle Golden/Cyan Accent Ring */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.31, 0.02, 16, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};
