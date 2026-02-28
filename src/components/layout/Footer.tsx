import { Linkedin, Mail, Phone } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-100 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tighter mb-4">
                            MSK<span className="text-neon-blue">.</span>
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-sm">
                            Lead Frontend Engineer specializing in scalable web applications, micro-frontends, and Generative AI integration.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">About</a></li>
                            <li><a href="#experience" className="text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">Experience</a></li>
                            <li><a href="#projects" className="text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">Projects</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">
                                <Mail size={18} />
                                <a href="mailto:mainmanuskumar231@gmail.com">mainmanuskumar231@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">
                                <Phone size={18} />
                                <a href="tel:+919744209181">+91 9744209181</a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-neon-blue transition-colors">
                                <Linkedin size={18} />
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        © {currentYear} Manu S Kumar · Built with passion
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        Open to Lead Frontend, GenAI, and Staff Engineer opportunities.
                    </p>
                </div>
            </div>
        </footer>
    );
}
