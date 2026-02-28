import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from './SoundContext';

type TransitionContextType = {
    navigateWithTransition: (targetId: string) => void;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const { playWhoosh } = useSound();

    const navigateWithTransition = useCallback((targetId: string) => {
        if (isAnimating) return;

        setIsAnimating(true);
        playWhoosh();

        // Wait for wipe to cover screen
        setTimeout(() => {
            // Perform the scroll
            const element = document.getElementById(targetId.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'instant' });
            }

            // Wipe away
            setTimeout(() => {
                setIsAnimating(false);
            }, 100);
        }, 600);
    }, [isAnimating, playWhoosh]);

    return (
        <TransitionContext.Provider value={{ navigateWithTransition }}>
            {children}

            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0, originY: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[110] bg-neon-blue origin-bottom flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="text-white text-6xl font-black tracking-tighter mix-blend-overlay"
                        >
                            LOADING_
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransition must be used within a TransitionProvider');
    }
    return context;
}
