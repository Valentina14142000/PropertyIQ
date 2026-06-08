
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Building2,
  PieChart
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-20 flex items-center bg-transparent absolute top-0 w-full z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-headline font-bold text-primary tracking-tight">
            Property<span className="text-accent">IQ</span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors hidden md:block">Features</Link>
          <Link href="#about" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors hidden md:block">About</Link>
          <Button asChild className="bg-primary text-white font-headline px-6 rounded-full hover:bg-primary/90 transition-all">
            <Link href="/dashboard">Launch Portal</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 blur-3xl bg-gradient-to-l from-accent to-transparent" />
          <div className="container px-6 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold">
                  <Zap className="w-4 h-4" /> Smart Real Estate Investing
                </div>
                <h1 className="text-5xl lg:text-7xl font-headline font-bold text-primary leading-[1.1]">
                  Analyze Properties with <span className="text-accent">Precision.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  PropertyIQ leverages advanced AI to help you identify high-yield investment opportunities, simulate mortgage scenarios, and generate real-time market reports.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-primary text-white font-headline h-14 px-8 text-lg rounded-xl">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl border-primary/20 text-primary font-headline">
                    View Demo
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-muted overflow-hidden">
                        <Image src={`https://picsum.photos/seed/user${i}/100/100`} width={40} height={40} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trusted by <span className="font-bold text-primary">500+</span> serious investors
                  </p>
                </div>
              </div>
              <div className="relative animate-in zoom-in-95 duration-700">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50">
                  <Image 
                    src="https://picsum.photos/seed/city/800/600" 
                    width={800} 
                    height={600} 
                    alt="Property View" 
                    className="object-cover"
                    data-ai-hint="luxury property"
                  />
                </div>
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-muted hidden sm:block animate-bounce-slow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Projected ROI</span>
                  </div>
                  <div className="text-3xl font-headline font-bold text-primary">12.4%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="container px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-headline font-bold text-primary tracking-tight">Built for Data-Driven Investors</h2>
              <p className="text-lg text-muted-foreground">Everything you need to build and manage a profitable real estate portfolio in one intuitive platform.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Building2 className="w-8 h-8 text-primary" />}
                title="Property Analysis"
                description="Instant property valuation and investment metrics driven by local market data and historical trends."
              />
              <FeatureCard 
                icon={<Zap className="w-8 h-8 text-accent" />}
                title="AI Market Reports"
                description="Get ahead of the curve with AI-generated forecasts and emerging neighborhood trend identification."
              />
              <FeatureCard 
                icon={<PieChart className="w-8 h-8 text-primary" />}
                title="ROI Simulators"
                description="Model complex financial scenarios including tax implications, appreciation, and renovation costs."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
             <BarChart3 className="w-96 h-96 -rotate-12 translate-x-20 -translate-y-20" />
          </div>
          <div className="container px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl font-headline font-bold text-white mb-6">Ready to Scale Your Portfolio?</h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">Join the new era of property investing. Get the insights you need to make confident, profitable decisions every time.</p>
            <Button asChild size="lg" className="bg-accent text-white hover:bg-accent/90 px-10 h-14 rounded-full text-lg font-headline shadow-lg shadow-accent/20">
              <Link href="/dashboard">Access Dashboard Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="text-xl font-headline font-bold text-primary">PropertyIQ</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2024 PropertyIQ Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-background border border-muted hover:border-accent/30 transition-all group">
      <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
        {icon}
      </div>
      <h3 className="text-2xl font-headline font-bold text-primary mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
