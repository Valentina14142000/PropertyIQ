"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, Building, Target, Loader2, Lightbulb, Calculator, Trash2, TriangleAlert } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PropertyImage } from "@/components/property-image"
import { useProperties } from "@/lib/store"
import { ASSUMPTIONS, compactUsd, metricsFor, projectValue, usd } from "@/lib/metrics"

type Analysis = {
  overallSummary: string
  score: number
  opportunities: string[]
  risks: string[]
  keyInvestmentInsights: string[]
  recommendation: string
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { properties, ready, remove } = useProperties()
  const property = properties.find((p) => p.id === id)

  const [busy, setBusy] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState("")

  if (!ready) return <Skeleton className="h-96 max-w-6xl mx-auto rounded-xl" />
  if (!property) {
    return (
      <div className="p-8 text-center space-y-4">
        <p>Property not found. It may have been removed.</p>
        <Button asChild><Link href="/dashboard/properties">Back to properties</Link></Button>
      </div>
    )
  }

  const m = metricsFor(property)
  const projection = Array.from({ length: 11 }, (_, y) => ({ year: y === 0 ? "Now" : `Y${y}`, value: Math.round(projectValue(property.price, property.growthRate, y)) }))
  const calcLink = `/dashboard/calculators?price=${property.price}&rent=${property.estimatedRent}&expenses=${Math.round(property.price * ((ASSUMPTIONS.propertyTaxPct + ASSUMPTIONS.insurancePct + ASSUMPTIONS.maintenancePct) / 1200))}`

  async function analyze() {
    if (!property) return
    setBusy(true)
    setError("")
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          address: property.address, price: property.price, type: property.type, bedrooms: property.bedrooms,
          bathrooms: property.bathrooms, sqft: property.sqft, yearBuilt: property.yearBuilt,
          description: property.description, neighborhood: property.neighborhood,
          estimatedRent: property.estimatedRent, growthRate: property.growthRate,
          metrics: { grossYield: m.grossYield, capRate: m.capRate, monthlyCashflow: m.monthlyCashflow, cashOnCash: m.cashOnCash },
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Analysis failed. Please try again.")
      setAnalysis(data as Analysis)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  const stat = (label: string, value: string, tone = "text-primary") => (
    <div className="bg-background rounded-lg p-3 text-center border min-w-0">
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-base sm:text-lg font-bold truncate ${tone}`}>{value}</div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-start gap-3">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/properties")} className="rounded-full shrink-0" aria-label="Back to properties">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary break-words">{property.address}</h2>
          <p className="text-muted-foreground flex items-center gap-2 text-sm"><Building className="w-4 h-4" /> {property.type} &bull; Built {property.yearBuilt}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Delete property" className="text-destructive shrink-0"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this property?</AlertDialogTitle>
              <AlertDialogDescription>It will be removed from your list and dashboard in this browser.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { remove(property.id); router.push("/dashboard/properties") }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="relative h-56 sm:h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <PropertyImage src={property.image} alt={property.address} className="w-full h-full object-cover" />
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader><CardTitle className="font-headline text-xl">Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              <p className="text-sm text-muted-foreground"><b className="text-foreground">Neighborhood:</b> {property.neighborhood}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stat("Price", usd(property.price))}
                {stat("Bed / Bath", `${property.bedrooms} / ${property.bathrooms}`)}
                {stat("Size", `${property.sqft.toLocaleString()} sqft`)}
                {stat("Est. rent", `${usd(property.estimatedRent)}/mo`, "text-accent")}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Returns</CardTitle>
              <CardDescription>
                Assumes {ASSUMPTIONS.downPaymentPct}% down, {ASSUMPTIONS.interestRate}% rate over {ASSUMPTIONS.termYears} years, {ASSUMPTIONS.vacancyPct}% vacancy, {ASSUMPTIONS.propertyTaxPct}% tax, {ASSUMPTIONS.insurancePct}% insurance and {ASSUMPTIONS.maintenancePct}% maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stat("Gross yield", `${m.grossYield.toFixed(2)}%`)}
                {stat("Cap rate", `${m.capRate.toFixed(2)}%`)}
                {stat("Cash flow", `${usd(m.monthlyCashflow)}/mo`, m.monthlyCashflow >= 0 ? "text-accent" : "text-destructive")}
                {stat("Cash-on-cash", `${m.cashOnCash.toFixed(2)}%`, m.cashOnCash >= 0 ? "text-accent" : "text-destructive")}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Projected value at {property.growthRate}% yearly growth</p>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projection} margin={{ left: 0, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} stroke="#888" />
                      <YAxis width={56} fontSize={12} tickLine={false} axisLine={false} stroke="#888" tickFormatter={(v) => compactUsd(v)} domain={["dataMin", "dataMax"]} />
                      <Tooltip formatter={(v: number) => [usd(v), "Value"]} />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#pv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Button asChild variant="outline" className="gap-2"><Link href={calcLink}><Calculator className="w-4 h-4" /> Open in calculators</Link></Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 min-w-0">
          <Card className="border-2 border-primary/10 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-accent" />
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-accent text-accent">AI-powered</Badge>
              </div>
              <CardTitle className="font-headline text-2xl text-primary">Investment Analysis</CardTitle>
              <CardDescription>Opportunities, risks and a verdict for this property.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!analysis ? (
                <div className="text-center py-4 space-y-4">
                  <p className="text-sm text-muted-foreground">The AI reviews the property details and the returns above and writes an investor-style assessment.</p>
                  {error && (
                    <p role="alert" className="text-sm text-destructive flex items-start gap-2 text-left bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                      <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                    </p>
                  )}
                  <Button onClick={analyze} disabled={busy} className="w-full font-headline h-12 text-base">
                    {busy ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</> : error ? "Try again" : "Run AI analysis"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${Math.max(0, Math.min(100, analysis.score))} 100`} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">{Math.round(analysis.score)}</span>
                    </div>
                    <div className="text-sm"><p className="font-bold text-primary">Investment score</p><p className="text-muted-foreground">out of 100</p></div>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-accent" /> Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
                  </div>
                  <List title="Key opportunities" items={analysis.opportunities} icon={<CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />} />
                  <List title="Potential risks" items={analysis.risks} icon={<AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />} />
                  {analysis.keyInvestmentInsights.length > 0 && <List title="Insights" items={analysis.keyInvestmentInsights} icon={<Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />} />}
                  <Separator />
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="font-bold text-primary text-sm mb-2">Recommendation</h4>
                    <p className="text-sm font-medium text-primary">{analysis.recommendation}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">AI-generated, for research only. Not financial advice. Verify all figures before investing.</p>
                  <Button variant="outline" onClick={() => setAnalysis(null)} className="w-full">Run again</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function List({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-primary text-sm mb-3 uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">{icon}<span>{item}</span></li>
        ))}
      </ul>
    </div>
  )
}
