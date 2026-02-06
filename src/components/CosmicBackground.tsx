import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 50;
      pos[i3 + 1] = (Math.random() - 0.5) * 50;
      pos[i3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  // Slow rotation animation
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function NebulaClouds() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate nebula particles with purple/blue tints
  const { positions, colors } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Cluster particles in a more spherical pattern
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 15;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
      
      // Purple to blue gradient
      const hue = 0.7 + Math.random() * 0.15; // 0.7-0.85 = purple-blue
      const color = new THREE.Color().setHSL(hue, 0.6, 0.3);
      cols[i3] = color.r;
      cols[i3 + 1] = color.g;
      cols[i3 + 2] = color.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.3}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GreenAccents() {
  const ref = useRef<THREE.Points>(null);
  
  // NVIDIA green accent particles
  const positions = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 40;
      pos[i3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.03;
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#76B900"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'linear-gradient(180deg, hsl(230 25% 3%) 0%, hsl(230 25% 8%) 50%, hsl(260 20% 6%) 100%)' }}
      >
        <ambientLight intensity={0.1} />
        <StarField />
        <NebulaClouds />
        <GreenAccents />
      </Canvas>
    </div>
  );
}
