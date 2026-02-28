import { motion } from 'framer-motion';
import { GraduationCap, Award, CheckCircle } from 'lucide-react';

export function CredentialsSection() {
    return (
        <section id="credentials" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex items-center gap-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Credentials & <span className="text-neon-blue">Education</span></h2>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow ml-4 hidden md:block"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Education Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 col-span-1 lg:col-span-2 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-neon-blue/10 dark:bg-neon-blue/20 rounded-xl text-neon-blue">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="text-2xl font-bold">Education</h3>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">B.Tech – ECE</h4>
                            <p className="text-lg text-slate-700 dark:text-slate-300">Govt. Engineering College, Barton Hill</p>
                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span>2014 – 2018</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Certifications Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-neon-purple/10 dark:bg-neon-purple/20 rounded-xl text-neon-purple">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold">Certifications</h3>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                <span className="text-neon-purple mt-1">▸</span>
                                Sustainable Software Architecture
                            </li>
                            <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                <span className="text-neon-purple mt-1">▸</span>
                                OWASP Top 10
                            </li>
                        </ul>
                    </motion.div>

                    {/* Awards Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 col-span-1 lg:col-span-3 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-slate-100/50 dark:to-slate-800/30 pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl text-amber-500">
                                <Award size={28} />
                            </div>
                            <h3 className="text-2xl font-bold">Awards & Recognition</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 font-bold text-xl">
                                    1
                                </div>
                                <h4 className="font-bold text-lg mb-1">Star of the Quarter</h4>
                                <p className="text-slate-500 text-sm">2022</p>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 font-bold text-xl">
                                    <Award size={20} />
                                </div>
                                <h4 className="font-bold text-lg mb-1">Multiple WOW Awards</h4>
                                <p className="text-slate-500 text-sm">Consistent Excellence</p>
                            </div>

                            <div className="p-6 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-500 mb-4 font-bold text-xl">
                                    <Award size={20} />
                                </div>
                                <h4 className="font-bold text-lg mb-1">IEEE Membership Team</h4>
                                <p className="text-slate-500 text-sm">2016</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
