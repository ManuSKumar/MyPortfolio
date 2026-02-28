import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, Terminal } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const projectsData = [
    {
        title: "RupeeTrace",
        description: "A comprehensive personal finance application built with React Native and WatermelonDB. Features include expense tracking, income management, and a dedicated Lending & Borrowing (Debts) module.",
        tech: ["React Native", "TypeScript", "WatermelonDB"],
        github: "https://github.com/yourusername/rupeetrace",
        live: "#",
        color: "from-green-500 to-emerald-700",
        featured: true
    },
    {
        title: "Imposter Game",
        description: "A fully functional multiplayer online Imposter Game featuring roles, game flow, and real-time multiplayer functionality. Designed with a funky, vibrant presentation and smooth animations.",
        tech: ["React 18", "Socket.io", "Tailwind CSS", "Framer Motion"],
        github: "https://github.com/yourusername/imposter-game",
        live: "#",
        color: "from-red-500 to-orange-600",
        featured: true
    },
    {
        title: "Anti-Gravity Mancala",
        description: "A 3D anti-gravity Mancala game set in a floating Victorian house. Built with Unity, it features physics-based gameplay, a unique zero-gravity mechanic, and multiplayer functionality using Mirror.",
        tech: ["Unity 3D", "C#", "Mirror", "URP"],
        github: "https://github.com/yourusername/anti-gravity-mancala",
        live: "#",
        color: "from-purple-500 to-indigo-700",
        featured: false
    },
    {
        title: "AI Chatbot Integration",
        description: "An AI chatbot integrated into a portfolio website capable of reading and answering questions based on a provided resume PDF file. Powered by the Groq SDK and a secure Node.js backend.",
        tech: ["React", "Node.js", "Express", "Groq SDK"],
        github: "https://github.com/yourusername/portfolio-chatbot",
        live: "#",
        color: "from-blue-500 to-cyan-600",
        featured: false
    },
];

export function ProjectsSection() {
    const { playHover, playClick } = useSound();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="projects" className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 max-w-[500px] w-full aspect-square bg-neon-blue/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 max-w-[500px] w-full aspect-square bg-neon-purple/5 rounded-full blur-3xl" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10" ref={containerRef}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex items-end justify-between"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Terminal className="text-neon-blue w-6 h-6" />
                            <span className="text-neon-blue font-mono font-medium tracking-wider text-sm uppercase">Featured Work</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-slate-900 dark:text-white">
                            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Projects</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            A curated selection of my recent technical endeavors, showcasing expertise in frontend architecture, full-stack integration, and creative interactive experiences.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {projectsData.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={`group relative rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 shadow-xl dark:shadow-2xl hover:shadow-neon-blue/5 transition-all duration-500`}
                        >
                            {/* Project Header / Visual Anchor */}
                            <div className={`h-48 md:h-64 w-full bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                                {/* Abstract Geometric Pattern specific to each project overlay */}
                                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }} />
                                
                                {/* Badge */}
                                {project.featured && (
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase">
                                        Featured
                                    </div>
                                )}
                                
                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    <a 
                                        href={project.github} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 bg-white text-slate-900 rounded-full cursor-pointer hover:scale-110 transition-transform hover:shadow-lg"
                                        title="View Source"
                                    >
                                        <Github size={24} />
                                    </a>
                                    <a 
                                        href={project.live} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 bg-neon-blue text-white rounded-full cursor-pointer hover:scale-110 transition-transform hover:shadow-lg hover:shadow-neon-blue/50"
                                        title="Live Demo"
                                    >
                                        <ExternalLink size={24} />
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10 relative">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-neon-blue transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3">
                                    {project.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tech.map((t, i) => (
                                        <span 
                                            key={i} 
                                            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-slate-700"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Glowing bottom border */}
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-neon-blue group-hover:w-full transition-all duration-500 ease-out" />
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <a 
                        href="https://github.com/yourusername" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                        <span>View more on GitHub</span>
                        <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
