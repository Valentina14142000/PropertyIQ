
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
import { Badge } from "@/components/ui/badge"
import { TriangleAlert, Copy, Check } from "lucide-react"

type Item = { title: string; detail: string }
type Report = {
  headline: string; executiveSummary: string; trends: Item[]; shifts: Item[]; forecast: string
  opportunities: string[]; risks: string[]; region: string; propertyType: string; timeframe: string; generatedAt: string
}

function reportText(r: Report) {
  const sec = (t: string, l: string[]) => (l.length ? `\n${t}\n${l.map((x) => `- ${x}`).join("\n")}\n` : "")
  return `${r.headline}\n${r.region} | ${r.propertyType} | ${r.timeframe}\n\n${r.executiveSummary}\n` +
    sec("Key trends", r.trends.map((t) => `${t.title}: ${t.detail}`)) + sec("Market shifts", r.shifts.map((t) => `${t.title}: ${t.detail}`)) +
    `\nForecast\n${r.forecast}\n` + sec("Opportunities", r.opportunities) + sec("Risks", r.risks) +
    "\nAI-generated, for research only. Not financial advice."
}

export default function MarketTrendsPage() {
  const [region, setRegion] = useState("San Francisco Bay Area")
  const [propertyType, setPropertyType] = useState("residential")
  const [timeframe, setTimeframe] = useState("next 6 months")
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError("")
    try {
      const res = await fetch("/api/market-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ region, propertyType, timeframe }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to generate the report.")
      setReport(data as Report)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate the report.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function copy() {
    if (!report) return
    try {
      await navigator.clipboard.writeText(reportText(report))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-primary">Market Insights</h2>
          <p className="text-muted-foreground">AI-generated market trend forecasts and analysis.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-accent font-medium bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <Sparkles className="w-4 h-4" /> Generated on demand
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
          <CardFooter className="flex-col gap-3 items-stretch">
            {error && <p role="alert" className="text-sm text-destructive flex items-start gap-2"><TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />{error}</p>}
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

        <div className="md:col-span-2 min-w-0">
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
               <CardHeader className="bg-white pb-4">
                  <Badge className="bg-accent/10 text-accent border-accent/20 mb-2 uppercase tracking-widest px-3 py-1 w-fit">AI market report</Badge>
                  <CardTitle className="text-2xl sm:text-3xl font-headline font-bold text-primary">{report.headline}</CardTitle>
                  <CardDescription className="mt-1">{report.region} &bull; {report.propertyType} &bull; {report.timeframe}</CardDescription>
               </CardHeader>
               <CardContent className="bg-white space-y-6">
                  <p className="text-foreground/80 leading-relaxed">{report.executiveSummary}</p>
                  <Block title="Key trends" items={report.trends} />
                  <Block title="Market shifts" items={report.shifts} />
                  <div>
                    <h4 className="font-headline font-bold text-primary mb-2">Forecast</h4>
                    <p className="text-muted-foreground leading-relaxed">{report.forecast}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Bullets title="Opportunities" items={report.opportunities} dot="bg-accent" />
                    <Bullets title="Risks" items={report.risks} dot="bg-destructive" />
                  </div>
               </CardContent>
               <CardFooter className="bg-muted/30 border-t py-4 flex flex-wrap gap-3 justify-between">
                  <p className="text-xs text-muted-foreground italic">
                    AI-generated on {new Date(report.generatedAt).toLocaleDateString()}. Research only, not financial advice. Verify figures against current local data.
                  </p>
                  <Button variant="outline" size="sm" onClick={copy} className="gap-1">
                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy report</>}
                  </Button>
               </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Block({ title, items }: { title: string; items: Item[] }) {
  if (!items.length) return null
  return (
    <div>
      <h4 className="font-headline font-bold text-primary mb-3">{title}</h4>
      <ul className="space-y-3">
        {items.map((t, i) => (
          <li key={i} className="text-sm"><span className="font-semibold text-foreground">{t.title}.</span> <span className="text-muted-foreground">{t.detail}</span></li>
        ))}
      </ul>
    </div>
  )
}

function Bullets({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  if (!items.length) return null
  return (
    <div>
      <h4 className="font-headline font-bold text-primary mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground"><span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${dot}`} />{t}</li>
        ))}
      </ul>
    </div>
  )
}
