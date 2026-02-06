import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AgentStatus } from '@/types/chat';

interface AgentOrchestrationProps {
  agents: AgentStatus[];
  isActive: boolean;
}

function OrchestratorCore({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current && isActive) {
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group>
      {/* Core glow */}
      <mesh ref={glowRef}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial
          color="#76B900"
          transparent
          opacity={isActive ? 0.4 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Core */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial
          color={isActive ? "#76B900" : "#3d5e00"}
          wireframe
        />
      </mesh>
    </group>
  );
}

function AgentNode({ agent, index, total }: { agent: AgentStatus; index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>>(null);
  
  const angle = (index / total) * Math.PI * 2;
  const radius = 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  useFrame((state) => {
    if (meshRef.current) {
      if (agent.status === 'active') {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.3);
      } else {
        meshRef.current.scale.setScalar(agent.status === 'completed' ? 1 : 0.7);
      }
    }
    if (lineRef.current && agent.status === 'active') {
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 
        0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
    }
  });

  const color = useMemo(() => {
    switch (agent.status) {
      case 'active': return '#76B900';
      case 'completed': return '#4a7500';
      default: return '#2a4500';
    }
  }, [agent.status]);

  // Connection line to center
  const lineGeometry = useMemo(() => {
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [x, y]);

  return (
    <group>
      {/* Connection line */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: agent.status === 'idle' ? 0.2 : 0.6 }))} ref={lineRef} />
      
      {/* Agent node */}
      <group position={[x, y, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.15}
          color={agent.status === 'active' ? '#76B900' : '#666666'}
          anchorX="center"
          anchorY="bottom"
        >
          {agent.name}
        </Text>
      </group>
    </group>
  );
}

function ParticleFlow({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 2;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = 0;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = 0;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        
        // Reset particles that go too far
        const dist = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2);
        if (dist > 2.5) {
          const angle = Math.random() * Math.PI * 2;
          positions[i * 3] = Math.cos(angle) * 0.5;
          positions[i * 3 + 1] = Math.sin(angle) * 0.5;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isActive) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#76B900"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function AgentOrchestration({ agents, isActive }: AgentOrchestrationProps) {
  if (!isActive && agents.length === 0) return null;

  return (
    <div className="h-40 w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <OrchestratorCore isActive={isActive} />
        {agents.map((agent, i) => (
          <AgentNode key={agent.id} agent={agent} index={i} total={agents.length} />
        ))}
        <ParticleFlow isActive={isActive} />
      </Canvas>
    </div>
  );
}
