import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type SoundContextType = {
    isMuted: boolean;
    toggleMute: () => void;
    playHover: () => void;
    playClick: () => void;
    playType: () => void;
    playWhoosh: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

    // Initialize AudioContext only after user interaction to respect browser auto-play policies
    const initAudio = useCallback(() => {
        if (!audioCtx) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            setAudioCtx(ctx);
        }
    }, [audioCtx]);

    useEffect(() => {
        window.addEventListener('click', initAudio, { once: true });
        window.addEventListener('keydown', initAudio, { once: true });
        return () => {
            window.removeEventListener('click', initAudio);
            window.removeEventListener('keydown', initAudio);
        };
    }, [initAudio]);

    const playTone = useCallback((frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
        if (isMuted || !audioCtx) return;

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }, [audioCtx, isMuted]);

    const playHover = useCallback(() => {
        playTone(600, 'sine', 0.1, 0.05); // High, soft, quick
    }, [playTone]);

    const playClick = useCallback(() => {
        playTone(400, 'square', 0.15, 0.08); // Mechanical click
    }, [playTone]);

    const playType = useCallback(() => {
        playTone(800 + Math.random() * 200, 'triangle', 0.05, 0.03); // Random high pitched typing
    }, [playTone]);

    const playWhoosh = useCallback(() => {
        // A quick slide down in frequency
        if (isMuted || !audioCtx) return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    }, [audioCtx, isMuted]);

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playHover, playClick, playType, playWhoosh }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
