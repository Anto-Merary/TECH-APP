import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSphere({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[scale, 32, 32]} position={position}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </Sphere>
    </Float>
  );
}

function FloatingBox({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
      <Box ref={meshRef} args={[scale, scale, scale]} position={position}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </Box>
    </Float>
  );
}

function FloatingTorus({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <Torus ref={meshRef} args={[scale, scale * 0.4, 16, 32]} position={position}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </Torus>
    </Float>
  );
}

function FloatingCone({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.9}>
      <Cone ref={meshRef} args={[scale * 0.6, scale, 8]} position={position}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </Cone>
    </Float>
  );
}

function Scene() {
  const shapes = useMemo(() => [
    { type: 'sphere', position: [-3, 2, -2] as [number, number, number], color: '#FF8C42', scale: 0.6 },
    { type: 'box', position: [3, -1, -3] as [number, number, number], color: '#4ECDC4', scale: 0.8 },
    { type: 'torus', position: [-2, -2, -1] as [number, number, number], color: '#FFD93D', scale: 0.5 },
    { type: 'sphere', position: [2.5, 2.5, -2] as [number, number, number], color: '#6BCB77', scale: 0.4 },
    { type: 'cone', position: [0, 3, -3] as [number, number, number], color: '#FF6B6B', scale: 0.7 },
    { type: 'box', position: [-3.5, 0, -2] as [number, number, number], color: '#C9B1FF', scale: 0.5 },
    { type: 'torus', position: [3.5, 1, -1] as [number, number, number], color: '#FF8C42', scale: 0.4 },
    { type: 'sphere', position: [0, -2.5, -2] as [number, number, number], color: '#4ECDC4', scale: 0.5 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, 3]} intensity={0.4} color="#FFD93D" />
      
      {shapes.map((shape, index) => {
        switch (shape.type) {
          case 'sphere':
            return <FloatingSphere key={index} position={shape.position} color={shape.color} scale={shape.scale} />;
          case 'box':
            return <FloatingBox key={index} position={shape.position} color={shape.color} scale={shape.scale} />;
          case 'torus':
            return <FloatingTorus key={index} position={shape.position} color={shape.color} scale={shape.scale} />;
          case 'cone':
            return <FloatingCone key={index} position={shape.position} color={shape.color} scale={shape.scale} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
