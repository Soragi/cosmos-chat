import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate sparse star positions for minimal look
  const positions = useMemo(() => {
    const pos = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 80;
      pos[i3 + 1] = (Math.random() - 0.5) * 80;
      pos[i3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  // Very slow, subtle rotation
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.005;
      ref.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function SubtleAccents() {
  const ref = useRef<THREE.Points>(null);
  
  // Very few green accent particles
  const positions = useMemo(() => {
    const count = 20;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 60;
      pos[i3 + 1] = (Math.random() - 0.5) * 60;
      pos[i3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.008;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#76B900"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'linear-gradient(180deg, hsl(230 20% 4%) 0%, hsl(230 18% 6%) 100%)' }}
      >
        <StarField />
        <SubtleAccents />
      </Canvas>
    </div>
  );
}
