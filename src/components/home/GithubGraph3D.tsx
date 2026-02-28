import { useRef, useState, useEffect, cloneElement } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { GitHubCalendar } from 'react-github-calendar';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

export type DayData = {
    count: number;
    date: string;
    intensity: number;
};

// Generate mock contribution data (52 weeks * 7 days)
const generateMockData = (): DayData[][] => {
    const data: DayData[][] = [];
    for (let w = 0; w < 52; w++) {
        const week: DayData[] = [];
        for (let d = 0; d < 7; d++) {
            week.push({ count: 0, date: '', intensity: 0 });
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

function Box({ position, day, index }: { position: [number, number, number], day: DayData, index: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const color = new THREE.Color(colors[day.intensity]);

    // Animate scale on hover and render
    const targetScale = hovered ? 1.5 : 1;
    const targetY = hovered ? position[1] + 0.5 : position[1] + (day.intensity > 0 ? day.intensity * 0.2 : 0);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, hovered ? targetScale * 1.5 : day.intensity * 0.4 + 0.1, targetScale), 0.1);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);

            // Add a subtle hovering effect to the active boxes
            if (day.intensity > 0 && !hovered) {
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
                emissiveIntensity={hovered ? 0.8 : (day.intensity > 0 ? 0.2 : 0)}
                roughness={0.2}
                metalness={0.8}
            />
            {hovered && day.count > 0 && (
                <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
                    <div className="bg-slate-800 text-slate-300 text-xs py-1.5 px-3 rounded-md whitespace-nowrap shadow-2xl border border-slate-700 pointer-events-none">
                        <span className="font-bold text-white tracking-widest">{day.count}</span> contribution{day.count !== 1 ? 's' : ''} on {day.date}
                    </div>
                </Html>
            )}
        </mesh>
    );
}

function GraphMap({ data }: { data: DayData[][] }) {
    const groupRef = useRef<THREE.Group>(null);

    // Center the graph
    const width = data.length || 52;
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
                week.map((day, d) => (
                    <Box
                        key={`${w}-${d}`}
                        index={w * 7 + d}
                        position={[offsetX + w, 0, offsetZ + d]}
                        day={day}
                    />
                ))
            )}

            {/* Grid Floor */}
            <gridHelper args={[60, 60, '#334155', '#1e293b']} position={[0, -0.5, 0]} />
        </group>
    );
}

export function GithubGraph3D() {
    const [selectedYear, setSelectedYear] = useState<number | 'last'>('last');
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    
    // For 3D view data
    const [graphData, setGraphData] = useState<DayData[][]>([]);
    const [totalContributions, setTotalContributions] = useState<number | null>(null);

    const currentYear = new Date().getFullYear();
    const years = ['last', currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

    useEffect(() => {
        if (viewMode === '3d') {
            const yearParam = selectedYear === 'last' ? currentYear - 1 : selectedYear;
            fetch(`https://github-contributions-api.deno.dev/ManuSKumar.json?y=${yearParam}`)
                .then(res => res.json())
                .then(json => {
                    if (json && json.contributions) {
                        setTotalContributions(json.totalContributions || null);
                        
                        const weeksList: DayData[][] = json.contributions.map((week: any[]) => 
                            week.map((d: any) => {
                                const count = d.contributionCount || 0;
                                let intensity = 0;
                                if (count > 0 && count <= 2) intensity = 1;
                                else if (count > 2 && count <= 5) intensity = 2;
                                else if (count > 5 && count <= 10) intensity = 3;
                                else if (count > 10) intensity = 4;
                                
                                // Return the exact date format the API yields (e.g. YYYY-MM-DD or readable)
                                const dateObj = new Date(d.date);
                                const readableDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                
                                return {
                                    count,
                                    date: readableDate,
                                    intensity
                                };
                            })
                        );
                        
                        setGraphData(weeksList);
                    } else {
                        setGraphData(generateMockData());
                    }
                })
                .catch((e) => {
                    console.error("Failed to fetch Github data for 3D view", e);
                    setGraphData(generateMockData());
                });
        }
    }, [selectedYear, viewMode, currentYear]);

    return (
        <div className={`w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transition-all duration-500 ${viewMode === '3d' ? 'h-[500px] bg-slate-900' : 'bg-slate-900 p-4 md:p-8 flex flex-col items-center'}`}>
            {/* Header and Controls Overlay */}
            <div className={`w-full flex flex-col lg:flex-row justify-between items-start gap-4 z-10 ${viewMode === '3d' ? 'absolute top-0 left-0 right-0 p-4 md:p-6 pointer-events-none box-border' : 'mb-6'}`}>
                <div className={viewMode === '3d' ? 'pointer-events-auto' : ''}>
                    <h3 className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
                        <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" className="fill-current text-white"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        Contribution Graph
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        My GitHub activity {selectedYear === 'last' ? 'over the last year' : `in ${selectedYear}`}
                        {viewMode === '3d' && totalContributions !== null && (
                            <span className="ml-2 font-medium text-neon-blue">({totalContributions} contributions)</span>
                        )}
                    </p>
                </div>

                <div className={`flex flex-col items-start lg:items-end gap-3 max-w-full ${viewMode === '3d' ? 'pointer-events-auto' : 'w-full lg:w-auto'}`}>
                    {/* View mode toggle */}
                    <div className="flex bg-slate-800/80 backdrop-blur-sm p-1 rounded-full self-start lg:self-end">
                        <button
                            onClick={() => setViewMode('2d')}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                                viewMode === '2d' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            2D Heatmap
                        </button>
                        <button
                            onClick={() => setViewMode('3d')}
                            className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                                viewMode === '3d' ? 'bg-slate-700 text-neon-blue shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            3D Interactive
                        </button>
                    </div>

                    {/* Year filter */}
                    <div className="flex flex-wrap justify-start lg:justify-end gap-2 max-w-full">
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year as number | 'last')}
                                className={`px-4 py-1.5 text-xs rounded-full font-medium transition-colors whitespace-nowrap ${
                                    selectedYear === year
                                        ? 'bg-neon-blue text-white shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                                        : 'bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                                }`}
                            >
                                {year === 'last' ? 'Last Year' : year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {viewMode === '2d' ? (
                <div className="w-full flex justify-center overflow-x-auto no-scrollbar pb-4 pt-4 text-white z-0 relative">
                    <div className="min-w-[750px] flex justify-center">
                        <GitHubCalendar 
                            username="ManuSKumar" 
                            year={selectedYear}
                            colorScheme="dark"
                            blockSize={15}
                            blockMargin={5}
                            fontSize={14}
                            theme={{
                                light: ['#1e293b', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                dark: ['#1e293b', '#0e4429', '#006d32', '#26a641', '#39d353'],
                            }}
                            renderBlock={(block, activity) => cloneElement(block, {
                                'data-tooltip-id': 'react-tooltip',
                                'data-tooltip-html': `${activity.count} contributions on ${activity.date}`,
                            })}
                        />
                        <Tooltip id="react-tooltip" />
                    </div>
                </div>
            ) : (
                <>
                    <Canvas camera={{ position: [0, 15, 30], fov: 40 }} className="absolute inset-0 z-0 cursor-move">
                        <color attach="background" args={['#0f172a']} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
                        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#0ea5e9" />

                        <GraphMap data={graphData} />

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
                    <div className="absolute bottom-4 right-6 text-xs text-slate-500 font-mono flex items-center gap-2 pointer-events-none z-10">
                        <span>[DRAG TO ROTATE]</span>
                        <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
                    </div>
                </>
            )}
        </div>
    );
}
