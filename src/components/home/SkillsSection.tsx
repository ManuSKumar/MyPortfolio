import { motion, type Variants } from 'framer-motion';

const skillsData = [
    {
        category: "Frontend Core",
        items: ["React.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"]
    },
    {
        category: "State Management",
        items: ["Redux Toolkit", "Redux-Saga", "Zustand", "MobX"]
    },
    {
        category: "Architecture",
        items: ["Micro Frontends", "Module Federation", "Web Components", "Design Systems", "Turborepo"]
    },
    {
        category: "GenAI & LLM",
        items: ["AWS Bedrock", "Claude", "LLaMA 3.1", "LangChain", "LangGraph", "MCP"]
    },
    {
        category: "Build & Testing",
        items: ["Vite", "Webpack", "Jest", "React Testing Library", "Git"]
    },
    {
        category: "Backend Integration",
        items: ["Node.js", "Express.js", "MongoDB", "MySQL"]
    }
];

export function SkillsSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex justify-end"
                >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow md:w-32 mr-4"></div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Core <span className="text-neon-purple">Competencies</span></h2>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {skillsData.map((skillGroup, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-neon-blue/50 dark:hover:border-neon-blue/50 transition-colors group"
                        >
                            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100 group-hover:text-neon-blue transition-colors">
                                {skillGroup.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
