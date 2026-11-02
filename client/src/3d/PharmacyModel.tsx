import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PharmacyModelProps {
  inStock?: boolean;
  pharmacyName?: string;
}

export const PharmacyModel: React.FC<PharmacyModelProps> = ({ inStock = true }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={hovered ? 1.05 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base Store Floor */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* Main Pharmacy Building */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 1.6, 1.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Glass Storefront Window */}
      <mesh position={[0, 0.1, 0.81]}>
        <planeGeometry args={[1.6, 1]} />
        <meshPhysicalMaterial
          color="#e0effe"
          transparent
          opacity={0.7}
          roughness={0.1}
          transmission={0.9}
        />
      </mesh>

      {/* Medical Cross Sign on Roof */}
      <group position={[0, 1.4, 0.4]}>
        <mesh>
          <boxGeometry args={[0.6, 0.2, 0.1]} />
          <meshStandardMaterial color="#0c8de9" emissive="#0c8de9" emissiveIntensity={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.2, 0.6, 0.1]} />
          <meshStandardMaterial color="#0c8de9" emissive="#0c8de9" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Floating Availability Ring & Pin */}
      <group position={[0, 2.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color={inStock ? '#10b981' : '#f59e0b'}
            emissive={inStock ? '#10b981' : '#f59e0b'}
            emissiveIntensity={1}
          />
        </mesh>
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial color={inStock ? '#059669' : '#d97706'} />
        </mesh>
      </group>
    </group>
  );
};
