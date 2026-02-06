import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  connections: number[];
}

function NetworkMesh() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const nodeCount = 150;
  const connectionDistance = 6;

  // Generate nodes with positions and velocities
  const { nodes, initialPositions } = useMemo(() => {
    const nodes: Node[] = [];
    const positions = new Float32Array(nodeCount * 3);
    
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 25 - 12;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      nodes.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        connections: [],
      });
    }
    
    return { nodes, initialPositions: positions };
  }, []);

  // Pre-allocate line geometry (max possible connections)
  const maxLines = nodeCount * 10;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), []);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Update node positions with gentle movement
    for (let i = 0; i < nodeCount; i++) {
      const node = nodes[i];
      node.position.add(node.velocity);
      
      // Bounce off boundaries
      if (Math.abs(node.position.x) > 27) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 17) node.velocity.y *= -1;
      if (node.position.z > 0 || node.position.z < -22) node.velocity.z *= -1;
      
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Calculate connections and update lines
    let lineIndex = 0;
    const nvidiaGreen = new THREE.Color('#76B900');
    const dimGreen = new THREE.Color('#2a4000');
    
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        
        if (dist < connectionDistance && lineIndex < maxLines) {
          const opacity = 1 - (dist / connectionDistance);
          const color = dimGreen.clone().lerp(nvidiaGreen, opacity * 0.5);
          
          const idx = lineIndex * 6;
          linePositions[idx] = nodes[i].position.x;
          linePositions[idx + 1] = nodes[i].position.y;
          linePositions[idx + 2] = nodes[i].position.z;
          linePositions[idx + 3] = nodes[j].position.x;
          linePositions[idx + 4] = nodes[j].position.y;
          linePositions[idx + 5] = nodes[j].position.z;
          
          lineColors[idx] = color.r;
          lineColors[idx + 1] = color.g;
          lineColors[idx + 2] = color.b;
          lineColors[idx + 3] = color.r;
          lineColors[idx + 4] = color.g;
          lineColors[idx + 5] = color.b;
          
          lineIndex++;
        }
      }
    }
    
    // Clear remaining lines
    for (let i = lineIndex * 6; i < maxLines * 6; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIndex * 2);
  });

  return (
    <group>
      {/* Network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#76B900"
          size={0.12}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35 - 18;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.03}
        transparent
        opacity={0.15}
        sizeAttenuation
      />
    </points>
  );
}

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'linear-gradient(180deg, hsl(230 20% 4%) 0%, hsl(235 18% 7%) 50%, hsl(230 15% 5%) 100%)' }}
      >
        <NetworkMesh />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
