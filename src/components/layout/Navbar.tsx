import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSound } from '../../context/SoundContext';
import { useTransition } from '../../context/TransitionContext';
import { Menu, X, Sun, Moon, Linkedin, Volume2, VolumeX, Terminal } from 'lucide-react';

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { playHover, playClick, isMuted, toggleMute } = useSound();
    const { navigateWithTransition } = useTransition();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Credentials', href: '#credentials' },
        { name: 'Contact', href: '#contact' },
    ];

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        playClick();
        setIsMobileMenuOpen(false);
        navigateWithTransition(href);
    };

    const handleTerminalOpen = () => {
        playClick();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-sm dark:shadow-slate-800/50 py-4'
                : 'bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-sm py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        playClick();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-2xl font-bold tracking-tighter"
                    onMouseEnter={playHover}
                >
                    MSK<span className="text-neon-blue">.</span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-6">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    className="text-sm font-medium hover:text-neon-blue transition-colors cursor-pointer"
                                    onMouseEnter={playHover}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-700 pl-4">
                        <button
                            onClick={handleTerminalOpen}
                            onMouseEnter={playHover}
                            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600"
                            aria-label="Open Terminal"
                        >
                            <Terminal size={14} className="text-slate-600 dark:text-slate-400" />
                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">Ctrl + K</span>
                        </button>
                        <button
                            onClick={() => { playClick(); toggleMute(); }}
                            onMouseEnter={playHover}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle sound"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <button
                            onClick={() => { playClick(); toggleTheme(); }}
                            onMouseEnter={playHover}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <a
                            href="https://www.linkedin.com/in/manu-s-kumar-07003317a/"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-neon-blue transition-colors cursor-pointer"
                            onMouseEnter={playHover}
                            onClick={playClick}
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                {/* Mobile menu toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={() => { playClick(); toggleMute(); }}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button
                        onClick={() => { playClick(); toggleTheme(); }}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => { playClick(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                        className="p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-light-bg dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 py-4 px-6 flex flex-col gap-4 shadow-xl">
                    <ul className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    className="text-lg font-medium hover:text-neon-blue transition-colors block cursor-pointer"
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}
