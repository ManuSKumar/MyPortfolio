import { motion } from 'framer-motion';
import { ThreeBackground } from './ThreeBackground';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
    return (
        <section id="hero" className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
            {/* Background Three.js */}
            <ThreeBackground />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-left flex flex-col items-start">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 inline-block px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 dark:bg-neon-blue/10 backdrop-blur-sm"
                >
                    <span className="text-sm font-semibold tracking-wider text-neon-blue uppercase">
                        Available for Opportunities
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6"
                >
                    Manu S Kumar
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed"
                >
                    Lead Frontend Engineer <span className="text-neon-purple mx-2">·</span> GenAI Integrator <span className="text-neon-blue mx-2">·</span> Scalable UI Architect
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <a
                        href="#projects"
                        className="group flex items-center justify-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 py-4 rounded-full font-medium transition-all hover:scale-105"
                    >
                        Explore Work
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                        href="#contact"
                        className="flex items-center justify-center bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white px-8 py-4 rounded-full font-medium transition-all hover:scale-105"
                    >
                        Let's Connect
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
