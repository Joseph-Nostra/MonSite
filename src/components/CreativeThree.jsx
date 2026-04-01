import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, ContactShadows } from '@react-three/drei';

const InteractiveSphere = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4);
    meshRef.current.rotation.y = Math.sin(time / 2);
    meshRef.current.position.y = Math.sin(time) * 0.2;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#7000ff" />
      <spotLight position={[0, 5, 0]} intensity={0.5} penumbra={1} castShadow />
      
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 256, 64]} />
        <MeshDistortMaterial
          color="#111"
          roughness={0.1}
          metalness={1}
          distort={0.4}
          speed={2}
          emissive="#00f2ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <ContactShadows 
        position={[0, -2.5, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4.5} 
      />
    </>
  );
};

const CreativeThree = () => {
  return (
    <section id="creative" className="h-[600px] w-full relative mb-32 rounded-[3.5rem] overflow-hidden bg-accent-blue/5 border border-white/5">
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center p-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Interactivité <span className="text-accent-blue text-glow">3D</span></h2>
        <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
          Explorez la fluidité et le dynamisme du développement créatif. Touchez et faites tourner cette forme pour ressentir l'innovation.
        </p>
      </div>
      
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <InteractiveSphere />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="px-6 py-2 glass-card rounded-full text-[10px] font-orbitron font-black tracking-widest text-accent-blue uppercase animate-bounce">
          Interaction Active
        </div>
      </div>
    </section>
  );
};

export default CreativeThree;
