
"use client"

import { useState, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar,
  Building,
  Target,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockProperties } from "@/lib/mock-data"
import { analyzeInvestmentProperty, InvestmentAnalysisOutput } from "@/ai/flows/ai-investment-analysis"

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const property = mockProperties.find(p => p.id === resolvedParams.id)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<InvestmentAnalysisOutput | null>(null)

  if (!property) {
    return <div className="p-8 text-center">Property not found.</div>
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeInvestmentProperty({
        address: property.address,
        price: property.price,
        propertyType: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFootage: property.sqft,
        yearBuilt: property.yearBuilt,
        description: property.description,
        neighborhoodFeatures: property.neighborhood,
        estimatedRentalIncome: property.estimatedRent,
      })
      setAnalysis(result)
    } catch (error) {
      console.error("Analysis failed", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">{property.address}</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Building className="w-4 h-4" /> {property.type} &bull; Built in {property.yearBuilt}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Property Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image 
              src={property.image} 
              alt={property.address} 
              fill 
              className="object-cover"
              data-ai-hint="property house interior"
            />
          </div>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Property Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {property.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Price</div>
                  <div className="text-lg font-bold text-primary">${property.price.toLocaleString()}</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bedrooms</div>
                  <div className="text-lg font-bold text-primary">{property.bedrooms}</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bathrooms</div>
                  <div className="text-lg font-bold text-primary">{property.bathrooms}</div>
                </div>
                <div className="bg-background rounded-lg p-3 text-center border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. Rent</div>
                  <div className="text-lg font-bold text-accent">${property.estimatedRent}/mo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Analysis Tool */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/10 shadow-lg overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Sparkles className="w-24 h-24" />
             </div>
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-accent" />
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-accent text-accent">Powered by AI</Badge>
              </div>
              <CardTitle className="font-headline text-2xl text-primary">Investment Analysis</CardTitle>
              <CardDescription>Generate deep insights and metrics for this property.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!analysis ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze market trends, comparable sales, and property specifics to provide a professional investment summary.
                  </p>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="w-full font-headline h-12 text-lg transition-all hover:scale-[1.02]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Run AI Analysis"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-accent" /> Summary
                    </h4>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{analysis.overallSummary}"
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary text-sm mb-3 uppercase tracking-wider">Key Opportunities</h4>
                    <ul className="space-y-2">
                      {analysis.opportunities.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary text-sm mb-3 uppercase tracking-wider">Potential Risks</h4>
                    <ul className="space-y-2">
                      {analysis.risks.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="font-bold text-primary text-sm mb-2">Final Recommendation</h4>
                    <p className="text-sm font-medium text-primary">
                      {analysis.recommendation}
                    </p>
                  </div>
                  
                  <Button variant="outline" onClick={() => setAnalysis(null)} className="w-full">
                    Reset Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-lg">Market Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-accent" /> Appreciation Trend
                  </span>
                  <span className="font-bold text-accent">High Growth</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Avg. Time on Market
                  </span>
                  <span className="font-bold">14 Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Info className="w-4 h-4" /> Demand Level
                  </span>
                  <span className="font-bold">Very High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
