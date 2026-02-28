import { motion } from 'framer-motion';
import { GithubGraph3D } from './GithubGraph3D';

export function AboutSection() {
    return (
        <section id="about" className="py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">About <span className="text-neon-blue">Me</span></h2>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow ml-4"></div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                        <p>
                            I am a Lead Frontend Engineer with over 6 years of experience designing and building scalable, high-performance web applications. My expertise lies in React, TypeScript, micro-frontend architecture, and modern state management solutions.
                        </p>
                        <p>
                            Recently, I have focused heavily on Generative AI integration, delivering production-grade features using AWS Bedrock, Claude, and LLaMA models. I am passionate about creating seamless, intelligent user experiences that push the boundaries of modern web technologies.
                        </p>
                        <p>
                            As a proven leader, I take strong ownership of projects, architect robust solutions, and have a solid track record of building reusable platforms and mentoring engineering teams.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-neon-blue/10 dark:bg-neon-blue/5 rounded-full blur-3xl"></div>

                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-neon-purple rounded-full block"></span>
                            Fast Facts
                        </h3>

                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Location</span>
                                <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">Thiruvananthapuram, India</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Experience</span>
                                <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">6+ Years</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Specialties</span>
                                <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">Frontend Arch, GenAI, Micro-frontends</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* 3D GitHub Contribution Graph */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-24"
                >
                    <GithubGraph3D />
                </motion.div>
            </div>
        </section>
    );
}
