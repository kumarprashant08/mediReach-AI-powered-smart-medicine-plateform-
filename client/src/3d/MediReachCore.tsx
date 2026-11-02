import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MedicineCapsule } from './MedicineCapsule';
import { MedicalParticles } from './MedicalParticles';
import { AIDataNetwork } from './AIDataNetwork';

const CentralCoreMesh: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15;
    }
  });

  return (
    <group
      ref={meshRef}
      scale={hovered ? 1.15 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central Glowing AI Sphere Core */}
      <mesh>
        <icosahedronGeometry args={[1.0, 3]} />
        <meshStandardMaterial
          color="#0c8de9"
          emissive="#026fc7"
          emissiveIntensity={0.6}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Inner Glowing Crystal Core */}
      <mesh>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Floating Medical Cross Structure inside Core */}
      <group scale={0.5}>
        <mesh>
          <boxGeometry args={[1.8, 0.5, 0.5]} />
          <meshStandardMaterial color="#ffffff" emissive="#7cc7fb" emissiveIntensity={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.5, 1.8, 0.5]} />
          <meshStandardMaterial color="#ffffff" emissive="#7cc7fb" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export const MediReachCore: React.FC = () => {
  const [webglSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  });

  if (!webglSupported) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-navy-900 to-navy-950 rounded-3xl p-8 text-center text-white border border-brand-500/20 shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-brand-500/20 flex items-center justify-center mb-4 animate-pulse">
          <span className="text-4xl">💊</span>
        </div>
        <h3 className="text-2xl font-bold text-cyan-400">MediReach AI Intelligence Core</h3>
        <p className="text-slate-300 text-sm max-w-sm mt-2">
          Real-time AI matching, OCR extraction & pharmacy stock synchronization active.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] md:h-[520px] relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-slate-950 via-navy-900 to-brand-950 border border-brand-400/20 shadow-2xl">
      {/* Always-visible animated HUD behind the WebGL scene. It also makes the Home hero feel alive while WebGL initializes. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 w-56 h-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 animate-[spin_18s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-400/20 animate-[spin_24s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
      </div>
      <Canvas
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8b5cf6" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#22d3ee" />

        <Suspense fallback={
          <Float speed={1.2} floatIntensity={0.8}>
            <CentralCoreMesh />
            <MedicalParticles count={60} />
          </Float>
        }>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <CentralCoreMesh />
            <AIDataNetwork />
            <MedicalParticles count={100} />

            {/* Orbiting Floating Capsules */}
            <MedicineCapsule position={[2.2, 1.2, 0]} colorTop="#0c8de9" colorBottom="#ffffff" scale={0.7} />
            <MedicineCapsule position={[-2.4, -0.8, 0.5]} colorTop="#8b5cf6" colorBottom="#22d3ee" scale={0.65} />
            <MedicineCapsule position={[1.5, -1.8, -0.5]} colorTop="#10b981" colorBottom="#ffffff" scale={0.6} />
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
        </Suspense>
      </Canvas>
    </div>
  );
};
