import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Generate mock contribution data (52 weeks * 7 days)
const generateMockData = () => {
    const data = [];
    for (let w = 0; w < 52; w++) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            // Randomize density to look natural (more activity towards recent weeks)
            const isActivePattern = Math.random() > 0.4;
            const intensity = isActivePattern ? Math.floor(Math.random() * 5) : 0;
            week.push(intensity);
        }
        data.push(week);
    }
    return data;
};

const colors = [
    '#1e293b', // 0: Empty (slate-800)
    '#0e4429', // 1: Low (dark green)
    '#006d32', // 2: Medium-Low
    '#26a641', // 3: Medium-High
    '#39d353', // 4: High (bright green)
];

function Box({ position, intensity, index }: { position: [number, number, number], intensity: number, index: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const color = new THREE.Color(colors[intensity]);

    // Animate scale on hover and render
    const targetScale = hovered ? 1.5 : 1;
    const targetY = hovered ? position[1] + 0.5 : position[1] + (intensity > 0 ? intensity * 0.2 : 0);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, hovered ? targetScale * 1.5 : intensity * 0.4 + 0.1, targetScale), 0.1);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

            // Add a subtle hovering effect to the active boxes
            if (intensity > 0 && !hovered) {
                meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.005;
            }
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[position[0], 0, position[2]]}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={hovered ? 0.8 : (intensity > 0 ? 0.2 : 0)}
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
    );
}

function GraphMap() {
    const data = useMemo(() => generateMockData(), []);
    const groupRef = useRef<THREE.Group>(null);

    // Center the graph
    const width = 52;
    const depth = 7;
    const offsetX = -width / 2 + 0.5;
    const offsetZ = -depth / 2 + 0.5;

    // Slowly rotate the entire graph
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {data.map((week, w) =>
                week.map((intensity, d) => (
                    <Box
                        key={`${w}-${d}`}
                        index={w * 7 + d}
                        position={[offsetX + w, 0, offsetZ + d]}
                        intensity={intensity}
                    />
                ))
            )}

            {/* Grid Floor */}
            <gridHelper args={[60, 60, '#334155', '#1e293b']} position={[0, -0.5, 0]} />
        </group>
    );
}

export function GithubGraph3D() {
    return (
        <div className="w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
                    <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" className="fill-current text-white"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    Contribution Graph
                </h3>
                <p className="text-slate-400 text-sm mt-1">Interactive 3D representation of GitHub activity.</p>
            </div>

            <Canvas camera={{ position: [0, 15, 30], fov: 40 }} className="cursor-move">
                <color attach="background" args={['#0f172a']} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#0ea5e9" />

                <GraphMap />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 3}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Interactive hint */}
            <div className="absolute bottom-4 right-6 text-xs text-slate-500 font-mono flex items-center gap-2">
                <span>[DRAG TO ROTATE]</span>
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
            </div>
        </div>
    );
}
