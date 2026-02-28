import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Use spring physics for smooth, non-linear tracking
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Center the 32px cursor
            cursorY.set(e.clientY - 16);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleElementHover = () => setIsHovering(true);
        const handleElementLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        // Attach hover listeners to all clickable elements
        const addHoverListeners = () => {
            const clickables = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
            clickables.forEach(el => {
                el.addEventListener('mouseenter', handleElementHover);
                el.addEventListener('mouseleave', handleElementLeave);
            });
        };

        // Initial attachment
        addHoverListeners();

        // Re-attach listeners on DOM mutations
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            const clickables = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', handleElementHover);
                el.removeEventListener('mouseleave', handleElementLeave);
            });
            observer.disconnect();
        };
    }, [cursorX, cursorY, isVisible]);

    return (
        <>
            <style>{`
        /* Hide default cursor only on devices with a mouse */
        @media (pointer: fine) {
          body, *, a, button {
            cursor: none !important;
          }
        }
      `}</style>
            <motion.div
                className="hidden md:flex fixed top-0 left-0 z-[100] rounded-full mix-blend-difference pointer-events-none items-center justify-center border-2 border-white"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    width: 32,
                    height: 32,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
                }}
                transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
                {/* Inner dot */}
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full bg-blend-difference"
                    animate={{
                        opacity: isHovering ? 0 : 1,
                        scale: isHovering ? 0 : 1,
                    }}
                />
            </motion.div>
        </>
    );
}
