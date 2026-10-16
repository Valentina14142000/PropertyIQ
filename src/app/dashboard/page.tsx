"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Building2, DollarSign, PieChart as PieChartIcon, Wallet, ArrowUpRight } from "lucide-react"
import { useProperties } from "@/lib/store"
import { compactUsd, metricsFor, projectValue, usd } from "@/lib/metrics"
import { AddPropertyDialog } from "@/components/property-form"

export default function DashboardPage() {
  const { properties, ready } = useProperties()

  const s = useMemo(() => {
    const rows = properties.map((p) => ({ p, m: metricsFor(p) }))
    const value = rows.reduce((a, r) => a + r.p.price, 0)
    const rent = rows.reduce((a, r) => a + r.p.estimatedRent, 0)
    const cashflow = rows.reduce((a, r) => a + r.m.monthlyCashflow, 0)
    const avgYield = value > 0 ? ((rent * 12) / value) * 100 : 0
    const projection = Array.from({ length: 6 }, (_, y) => ({
      year: y === 0 ? "Today" : `Year ${y}`,
      value: Math.round(properties.reduce((a, p) => a + projectValue(p.price, p.growthRate, y), 0)),
    }))
    const byType = new Map<string, { price: number; rent: number }>()
    for (const { p } of rows) {
      const t = byType.get(p.type) ?? { price: 0, rent: 0 }
      t.price += p.price
      t.rent += p.estimatedRent * 12
      byType.set(p.type, t)
    }
    const yields = [...byType.entries()].map(([category, t]) => ({ category, yield: +((t.rent / t.price) * 100).toFixed(2) }))
    const top = [...rows].sort((a, b) => b.m.cashOnCash - a.m.cashOnCash).slice(0, 5)
    const growth = projection[5].value - projection[0].value
    return { value, rent, cashflow, avgYield, projection, yields, top, growth, count: rows.length }
  }, [properties])

  if (!ready) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>

  if (s.count === 0) {
    return (
      <Card className="border-dashed border-2 bg-transparent max-w-xl mx-auto">
        <CardContent className="py-16 text-center space-y-4">
          <Building2 className="w-12 h-12 mx-auto text-primary/30" />
          <h2 className="text-xl font-headline font-bold text-primary">Your dashboard is empty</h2>
          <p className="text-muted-foreground">Add a property to see portfolio value, yield and cash flow.</p>
          <AddPropertyDialog />
        </CardContent>
      </Card>
    )
  }

  const kpis = [
    { label: "Tracked value", value: usd(s.value), sub: `${compactUsd(s.growth)} projected growth in 5 yrs`, icon: DollarSign, tone: "primary" },
    { label: "Avg. gross yield", value: `${s.avgYield.toFixed(2)}%`, sub: "Annual rent / price", icon: PieChartIcon, tone: "accent" },
    { label: "Properties", value: String(s.count), sub: `${usd(s.rent)} monthly rent`, icon: Building2, tone: "primary" },
    { label: "Est. monthly cash flow", value: usd(s.cashflow), sub: "After costs and a 20%-down mortgage", icon: Wallet, tone: "accent" },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className={`border-l-4 ${k.tone === "primary" ? "border-l-primary" : "border-l-accent"}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
              <k.icon className={`w-4 h-4 ${k.tone === "primary" ? "text-primary" : "text-accent"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold font-headline truncate ${k.label.includes("cash flow") && s.cashflow < 0 ? "text-destructive" : ""}`}>{k.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="font-headline">Portfolio projection</CardTitle>
            <CardDescription>Total value over 5 years using each property's growth rate</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.projection} margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="year" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis width={60} stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => compactUsd(v)} domain={["dataMin", "dataMax"]} />
                <Tooltip formatter={(v: number) => [usd(v), "Value"]} contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="font-headline">Gross yield by property type</CardTitle>
            <CardDescription>Annual rent as a share of price</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.yields} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="category" stroke="#888" fontSize={11} tickLine={false} axisLine={false} interval={0} tickFormatter={(v: string) => (v.length > 11 ? v.slice(0, 10) + "…" : v)} />
                <YAxis width={40} stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Gross yield"]} cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
                <Bar dataKey="yield" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Best opportunities</CardTitle>
            <CardDescription>Ranked by estimated cash-on-cash return</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm"><Link href="/dashboard/properties">All <ArrowUpRight className="w-4 h-4 ml-1" /></Link></Button>
        </CardHeader>
        <CardContent className="px-0">
          <ul>
            {s.top.map(({ p, m }) => (
              <li key={p.id}>
                <Link href={`/dashboard/properties/${p.id}`} className="flex items-center justify-between gap-4 px-6 py-3 border-t hover:bg-muted/40 transition-colors">
                  <span className="min-w-0">
                    <span className="block font-medium text-sm truncate">{p.address}</span>
                    <span className="block text-xs text-muted-foreground">{usd(p.price)} &bull; {p.type}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className={`block font-bold text-sm ${m.cashOnCash >= 0 ? "text-accent" : "text-destructive"}`}>{m.cashOnCash.toFixed(1)}% CoC</span>
                    <span className="block text-xs text-muted-foreground">{usd(m.monthlyCashflow)}/mo</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
