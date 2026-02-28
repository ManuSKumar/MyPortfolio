import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';

export function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-neon-blue/5 dark:bg-neon-blue/5 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Let's <span className="text-neon-blue">Connect</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                        I'm currently open to Lead Frontend, GenAI Integrator, and Staff Engineer opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <a
                            href="mailto:mainmanuskumar231@gmail.com"
                            className="flex items-center gap-3 bg-neon-blue text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
                        >
                            <Mail size={20} />
                            Say Hello
                        </a>

                        <a
                            href="tel:+919744209181"
                            className="flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
                        >
                            <Phone size={20} />
                            +91 9744209181
                        </a>
                    </div>

                    <div className="mt-16 flex justify-center gap-8">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex flex-col items-center gap-2 text-slate-500 hover:text-neon-blue transition-colors"
                        >
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-neon-blue/50 transition-colors">
                                <Linkedin size={24} />
                            </div>
                            <span className="text-sm font-medium flex items-center gap-1">
                                LinkedIn <ExternalLink size={12} />
                            </span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
