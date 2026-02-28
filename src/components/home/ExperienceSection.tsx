import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Building2 } from 'lucide-react';

const experienceData = [
    {
        role: "Lead Engineer",
        company: "Envestnet, Inc",
        location: "Thiruvananthapuram, India",
        date: "Oct 2024 – Present",
        achievements: [
            "Leading frontend architecture for enterprise-scale React applications",
            "Designing micro-frontend architecture using Module Federation",
            "Integrating Generative AI capabilities using AWS Bedrock & Claude",
            "Driving performance improvements: bundle optimization, lazy loading, caching",
            "Mentoring engineers and defining coding standards across teams"
        ]
    },
    {
        role: "Associate Lead Engineer",
        company: "Envestnet, Inc",
        location: "Thiruvananthapuram, India",
        date: "Oct 2022 – Sep 2024",
        achievements: [
            "Designed AI-powered UI features including chat assistants and content generators",
            "Integrated Claude and LLaMA models using secure, scalable patterns",
            "Contributed to monorepo setup using Turborepo",
            "Built reusable Web Components and shared libraries across products"
        ]
    },
    {
        role: "Senior Software Engineer",
        company: "Envestnet, Inc",
        location: "Thiruvananthapuram, India",
        date: "Jun 2021 – Sep 2022",
        achievements: [
            "Developed complex UI modules using React and TypeScript",
            "Built reusable component libraries to accelerate development",
            "Implemented unit testing with Jest and React Testing Library"
        ]
    },
    {
        role: "Software Engineer",
        company: "Kimball Electronics",
        location: "Trivandrum, India",
        date: "Jun 2018 – Jun 2021",
        achievements: [
            "Developed full-stack features using Node.js and database integrations",
            "Collaborated with cross-functional teams for production releases"
        ]
    }
];

export function ExperienceSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section id="experience" className="py-24 bg-slate-50 dark:bg-slate-900/40">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Professional <span className="text-neon-blue">Journey</span></h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        A timeline of my career, showcasing my progression and key contributions across different roles.
                    </p>
                </motion.div>

                <div ref={containerRef} className="relative space-y-12">
                    {/* The timeline line background */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800 md:-ml-[1px]"></div>

                    {/* The animated scrubbing timeline line */}
                    <motion.div
                        className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-neon-blue md:-ml-[1px] origin-top shadow-[0_0_10px_#0ea5e9]"
                        style={{ scaleY }}
                    ></motion.div>

                    {experienceData.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="relative pl-12 md:pl-0"
                        >
                            {/* Timeline dot */}
                            <div className="absolute top-[28px] md:top-0 left-[8px] md:left-1/2 md:-ml-[8px] w-4 h-4 rounded-full bg-neon-blue border-4 border-slate-50 dark:border-slate-900 z-10 shadow-sm"></div>

                            <div className={`md:flex items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                <div className="hidden md:block w-5/12"></div>

                                <div className="md:w-5/12 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow relative group">

                                    {/* Glowing border effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-blue/20 rounded-2xl transition-colors duration-300 pointer-events-none"></div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-neon-blue transition-colors">
                                        {job.role}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
                                        <span className="flex flex-wrap items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                            <Building2 size={16} className="text-neon-purple" />
                                            {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={16} />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            {job.date}
                                        </span>
                                    </div>

                                    <ul className="space-y-3">
                                        {job.achievements.map((achievement, i) => (
                                            <li key={i} className="flex items-start text-slate-600 dark:text-slate-400">
                                                <span className="mr-3 text-neon-blue mt-1 shrink-0">▸</span>
                                                <span className="text-sm leading-relaxed">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
