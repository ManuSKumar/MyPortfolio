import { ThemeProvider } from './context/ThemeContext'
import { SoundProvider } from './context/SoundContext'
import { TransitionProvider } from './context/TransitionContext'
import { Layout } from './components/layout/Layout'
import { CustomCursor } from './components/ui/CustomCursor'
import { TerminalOverlay } from './components/ui/TerminalOverlay'
import { AIAssistantWidget } from './components/ui/AIAssistantWidget'
import { HeroSection } from './components/home/HeroSection'
import { AboutSection } from './components/home/AboutSection'
import { SkillsSection } from './components/home/SkillsSection'
import { ExperienceSection } from './components/home/ExperienceSection'
import { ProjectsSection } from './components/home/ProjectsSection'
import { CredentialsSection } from './components/home/CredentialsSection'
import { ContactSection } from './components/home/ContactSection'

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <CustomCursor />
        <TerminalOverlay />
        <AIAssistantWidget />
        <TransitionProvider>
          <Layout>
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ProjectsSection />
            <CredentialsSection />
            <ContactSection />
          </Layout>
        </TransitionProvider>
      </SoundProvider>
    </ThemeProvider>
  )
}

export default App
