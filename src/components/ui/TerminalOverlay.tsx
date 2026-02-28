import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../context/SoundContext';
import resumeUrl from '../../assets/resume.pdf';

type OutputLine = {
    id: number;
    text: string;
    isCommand?: boolean;
};

export function TerminalOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<OutputLine[]>([
        { id: 1, text: 'MSK Terminal v1.0.0' },
        { id: 2, text: 'Type "help" for a list of available commands.' },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { playType, playClick } = useSound();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle on Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                if (!isOpen) {
                    playClick();
                }
            }

            // Close on escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                playClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, playClick]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    const addOutput = (text: string, isCommand = false) => {
        setOutput(prev => [...prev, { id: Date.now() + Math.random(), text, isCommand }]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        playClick();
        const cmd = input.trim().toLowerCase();
        addOutput(`visitor@msk:~$ ${cmd}`, true);
        setInput('');

        switch (cmd) {
            case 'help':
                addOutput('Available commands:');
                addOutput('  about     - Learn more about me');
                addOutput('  resume    - Download my resume');
                addOutput('  skills    - View technical capabilities');
                addOutput('  contact   - Get in touch');
                addOutput('  clear     - Clear terminal history');
                addOutput('  sudo      - Execute a command as superuser');
                addOutput('  exit      - Close terminal');
                break;
            case 'about':
                addOutput('Manu S. Kumar is a Lead Frontend Engineer specializing in GenAI and 3D web experiences.');
                break;
            case 'resume':
                addOutput('Initiating resume download...');
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = 'Manu_S_Kumar_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                break;
            case 'skills':
                addOutput('Generating skill matrix... [React, Typescript, Tailwind, Three.js, Node.js, Python, GenAI]');
                break;
            case 'contact':
                addOutput('Email: ms.kumar51@example.com (Mocked)');
                addOutput('LinkedIn: linkedIn.com/in/manuskumar');
                break;
            case 'clear':
                setOutput([]);
                break;
            case 'sudo rm -rf /':
            case 'sudo su':
                addOutput('Nice try. Incident reported.');
                break;
            case 'exit':
                setIsOpen(false);
                break;
            default:
                if (cmd.startsWith('sudo')) {
                    addOutput(`${cmd.split(' ')[0]}: permission denied`);
                } else {
                    addOutput(`Command not found: ${cmd}`);
                }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Terminal Window */}
                    <div className="relative w-full max-w-3xl bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl overflow-hidden font-mono text-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" onClick={() => setIsOpen(false)} />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="text-slate-400 text-xs">msk@portfolio ~ bash</div>
                            <div className="w-12"></div>
                        </div>

                        {/* Body */}
                        <div
                            ref={scrollRef}
                            className="h-[400px] overflow-y-auto p-4 text-slate-300"
                            onClick={() => inputRef.current?.focus()}
                        >
                            {output.map((line) => (
                                <div key={line.id} className={`mb-1 ${line.isCommand ? 'text-neon-blue' : ''}`}>
                                    {line.text}
                                </div>
                            ))}

                            <form onSubmit={handleCommand} className="mt-2 flex items-center">
                                <span className="text-neon-blue mr-2">visitor@msk:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={playType}
                                    className="flex-1 bg-transparent outline-none border-none text-slate-300 placeholder-slate-600"
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
