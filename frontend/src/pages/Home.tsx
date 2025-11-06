import { Header } from "@/components/homepage/Header"
import { HeroSection } from "@/components/homepage/HeroSection"
import { FeaturesSection } from "@/components/homepage/FeaturesSection"
import { BenefitsSection } from "@/components/homepage/BenefitsSection"
import { CTASection } from "@/components/homepage/CTASection"
import { Footer } from "@/components/homepage/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
