import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

function TechMatrix({ count = 100, theme = 'dark' }) {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate a grid of positions
    const { positions, originalYs } = useMemo(() => {
        // count represents dimensions (count x count grid)
        const total = count * count;
        const p = new Float32Array(total * 3);
        const yOriginal = new Float32Array(total);

        let i = 0;
        const spacing = 1.2;
        const offset = (count * spacing) / 2;

        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                p[i * 3] = (x * spacing) - offset; // x

                // Add some organic noise/hills to the grid
                const y = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 2;
                p[i * 3 + 1] = y - 5; // y (placed lower down)
                yOriginal[i] = y - 5;

                p[i * 3 + 2] = (z * spacing) - offset; // z
                i++;
            }
        }
        return { positions: p, originalYs: yOriginal };
    }, [count]);

    // Animate the grid like a digital wave
    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const time = clock.getElapsedTime() * 0.5;
        const currentPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                const index = i * 3 + 1; // y coordinate
                const origY = originalYs[i];
                // Make the grid wave dynamically over time
                currentPositions[index] = origY + Math.sin(time + (x * 0.1)) * Math.cos(time + (z * 0.1)) * 3;
                i++;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = time * 0.05; // Slow ambient rotation
    });

    const particleColor = theme === 'dark' ? '#00f0ff' : '#4f46e5';

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    opacity={theme === 'dark' ? 0.8 : 1.0}
                    color={particleColor}
                    size={theme === 'dark' ? 0.15 : 0.2}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export function ThreeBackground() {
    const { theme } = useTheme();

    return (
        <div className="absolute top-0 left-0 w-full h-[120vh] z-0 opacity-70 dark:opacity-[0.85] pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]">
            <Canvas camera={{ position: [0, 2, 20], fov: 60 }}>
                <TechMatrix count={45} theme={theme} />
            </Canvas>
        </div>
    );
}
