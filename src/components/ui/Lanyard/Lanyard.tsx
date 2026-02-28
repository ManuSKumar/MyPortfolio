/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Html } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { useSound } from '../../../context/SoundContext';
import photo from '../../../assets/photo.jpeg';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

const cardGLB = '/card.glb';
const lanyard = '/lanyard.png';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  onClose?: () => void;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  onClose
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute -top-20 right-0 w-full md:w-[800px] h-[1000px] z-30 pointer-events-none">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
        className="pointer-events-auto"
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} onClose={onClose} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  onClose?: () => void;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, onClose }: BandProps) {
  const { playHover, playWhoosh, playClick } = useSound();

  // Using "any" for refs since the exact types depend on Rapier's internals
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic' as any,
    canSleep: true,
    colliders: false,
    angularDamping: 15,
    linearDamping: 10
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyard);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      const fixedTrans = fixed.current.translation();
      const j3Trans = j3.current.translation();

      if (fixedTrans && j3Trans && !isNaN(fixedTrans.x) && !isNaN(j3Trans.x)) {
        [j1, j2].forEach(ref => {
          const t = ref.current.translation();
          if (!t || isNaN(t.x)) return;
          if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(t);
          const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(t)));
          ref.current.lerped.lerp(
            t,
            (delta || 0.01) * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
          );
        });

        if (j1.current.lerped && j2.current.lerped && !isNaN(j1.current.lerped.x) && !isNaN(j2.current.lerped.x)) {
          curve.points[0].copy(j3Trans);
          curve.points[1].copy(j2.current.lerped);
          curve.points[2].copy(j1.current.lerped);
          curve.points[3].copy(fixedTrans);
          
          band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
        }
      }
      
      // Calculate angular velocity with damping applied natively, protected against NaN
      const currentAngvel = card.current.angvel();
      const currentRot = card.current.rotation();
      if (currentAngvel && currentRot && !isNaN(currentAngvel.x) && !isNaN(currentRot.y)) {
        ang.copy(currentAngvel);
        rot.copy(currentRot); // Notice rot.copy assumes {x,y,z}, but rotation() is a quaternion. It's safe since copy() only reads x,y,z.
        card.current.setAngvel({ x: ang.x * 0.98, y: ang.y - rot.y * 0.25, z: ang.z * 0.98 });
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as any} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as any}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as any}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as any}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ('kinematicPosition' as any) : ('dynamic' as any)}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
          >
            <mesh
              geometry={nodes.card.geometry}
              onPointerOver={() => { hover(true); playHover(); }}
              onPointerOut={() => hover(false)}
              onPointerUp={(e: any) => {
                e.target.releasePointerCapture(e.pointerId);
                drag(false);
                playWhoosh();
              }}
              onPointerDown={(e: any) => {
                e.target.setPointerCapture(e.pointerId);
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              }}
            >
              <meshPhysicalMaterial
                color="#0f172a"
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
              <Html
                transform
                wrapperClass=""
                position={[0, 0.12, 0.01]}
                scale={0.155}
              >
                <div
                  className="w-[360px] h-[500px] pointer-events-auto bg-[#FF5B3A] flex flex-col overflow-hidden relative rounded-[2rem] border-[6px] border-slate-900 shadow-2xl will-change-transform transform-gpu"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'subpixel-antialiased',
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;

                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;

                    const glare = e.currentTarget.querySelector('.glare-effect') as HTMLElement;
                    if (glare) {
                      glare.style.opacity = '1';
                      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                    const glare = e.currentTarget.querySelector('.glare-effect') as HTMLElement;
                    if (glare) {
                      glare.style.opacity = '0';
                    }
                  }}
                >

                  {/* Dynamic Glare Overlay */}
                  <div className="glare-effect absolute inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-300"></div>

                  {/* Top Right Label */}
                  <div className="absolute top-6 right-6 font-black tracking-widest text-slate-900 text-[10px] bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-slate-900/10 z-20">
                    (PORTFOLIO)
                  </div>

                  {/* Close Button element (requires pointer-events to be auto just for button) */}
                  {onClose && (
                    <button
                      onClick={() => { playClick(); onClose(); }}
                      onMouseEnter={playHover}
                      className="absolute top-6 left-6 text-slate-900 hover:text-white hover:bg-slate-900/50 p-1.5 rounded-full transition-all pointer-events-auto bg-white/10 backdrop-blur-sm z-20"
                      title="Close Lanyard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}

                  {/* Profile Picture (Full size covering the entire card) */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <img
                      src={photo}
                      alt="Profile"
                      className="w-full h-full object-cover grayscale contrast-125 brightness-90 filter"
                    />
                  </div>

                  {/* Massive Typography Overlay */}
                  <div className="absolute bottom-10 left-0 w-full px-8 flex flex-col z-10 pointer-events-none">
                    <span className="text-white font-bold text-xs tracking-[0.2em] mb-1 drop-shadow-md">WEB / UI</span>
                    <h1 className="text-[3.2rem] leading-[0.85] font-black tracking-tighter text-white uppercase drop-shadow-lg">
                      LEAD <br /> FRONTEND <br /> ENGINEER
                    </h1>
                  </div>

                  {/* Tiny Copyright Footer */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center z-10 pointer-events-none">
                    <span className="text-[7px] font-bold text-white/80 tracking-[0.2em] uppercase">
                      ©2024, SKILLS NOT REPLACED BY AI (YET)
                    </span>
                  </div>
                </div>
              </Html>
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#1e293b" // slate-800
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
