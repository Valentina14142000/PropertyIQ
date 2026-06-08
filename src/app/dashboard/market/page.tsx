
"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  TrendingUp, 
  BarChart3, 
  Globe, 
  FileText, 
  Sparkles,
  Loader2,
  Clock,
  ArrowRight
} from "lucide-react"
import { aiMarketTrendReport, AiMarketTrendReportOutput } from "@/ai/flows/ai-market-trend-report-flow"

export default function MarketTrendsPage() {
  const [region, setRegion] = useState("San Francisco Bay Area")
  const [propertyType, setPropertyType] = useState("residential")
  const [timeframe, setTimeframe] = useState("next 6 months")
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<AiMarketTrendReportOutput | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await aiMarketTrendReport({
        region,
        propertyType,
        timeframe
      })
      setReport(res)
    } catch (error) {
      console.error("Failed to generate report", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Market Insights</h2>
          <p className="text-muted-foreground">AI-generated market trend forecasts and analysis.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-accent font-medium bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <Clock className="w-4 h-4" /> Updated hourly
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Report Settings</CardTitle>
            <CardDescription>Customize your analysis parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" /> Region
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="San Francisco Bay Area">San Francisco Bay Area</SelectItem>
                  <SelectItem value="Austin, Texas">Austin, Texas</SelectItem>
                  <SelectItem value="New York Metro">New York Metro</SelectItem>
                  <SelectItem value="South Florida">South Florida</SelectItem>
                  <SelectItem value="National (US)">National (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Property Type
              </label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="luxury homes">Luxury Homes</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Forecast Period
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next 3 months">Next 3 Months</SelectItem>
                  <SelectItem value="next 6 months">Next 6 Months</SelectItem>
                  <SelectItem value="next year">Next Year</SelectItem>
                  <SelectItem value="long-term (2-5 years)">Long-term (2-5 yrs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-white font-headline h-12"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          {!report ? (
            <Card className="h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 bg-transparent">
              <div className="bg-primary/5 p-6 rounded-full mb-6">
                <FileText className="w-16 h-16 text-primary/20" />
              </div>
              <h3 className="text-xl font-headline font-bold text-primary mb-2">No Report Generated</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Select your parameters and click "Generate Report" to receive an AI-powered market analysis.
              </p>
            </Card>
          ) : (
            <Card className="shadow-xl border-none animate-in slide-in-from-right-4 duration-500 overflow-hidden">
               <div className="h-2 bg-accent" />
               <CardHeader className="bg-white pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-accent/10 text-accent border-accent/20 mb-2 uppercase tracking-widest px-3 py-1">AI Intelligence Report</Badge>
                      <CardTitle className="text-3xl font-headline font-bold text-primary">
                        {region} Market Forecast
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        Focus: {propertyType} &bull; Period: {timeframe}
                      </CardDescription>
                    </div>
                    <FileText className="w-8 h-8 text-primary/10" />
                  </div>
               </CardHeader>
               <CardContent className="bg-white prose prose-slate max-w-none pt-0">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-body text-lg">
                    {report.report}
                  </div>
               </CardContent>
               <CardFooter className="bg-muted/30 border-t py-4 flex justify-between">
                  <p className="text-xs text-muted-foreground italic">
                    Report generated by PropertyIQ AI engine on {new Date().toLocaleDateString()}.
                  </p>
                  <Button variant="link" className="text-accent flex items-center gap-1 p-0">
                    Export PDF <ArrowRight className="w-3 h-3" />
                  </Button>
               </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
