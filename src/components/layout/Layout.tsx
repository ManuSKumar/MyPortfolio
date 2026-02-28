import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import Lanyard from '../ui/Lanyard/Lanyard';

export function Layout({ children }: { children: React.ReactNode }) {
    const [showLanyard, setShowLanyard] = React.useState(true);

    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />

            {/* 3D Lanyard ID Card shown on Desktop in the top right */}
            {showLanyard && (
                <div className="hidden lg:block z-30 absolute -top-20 right-0 w-full h-screen pointer-events-none">
                    <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} onClose={() => setShowLanyard(false)} />
                </div>
            )}

            <main className="flex-grow pt-24 pb-12 relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}
