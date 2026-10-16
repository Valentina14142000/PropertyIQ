"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BedDouble, Bath, Square, MapPin, TrendingUp, Search, RotateCcw, Building2 } from "lucide-react"
import { PropertyImage } from "@/components/property-image"
import { AddPropertyDialog } from "@/components/property-form"
import { useProperties } from "@/lib/store"
import { metricsFor, usd } from "@/lib/metrics"
import { Skeleton } from "@/components/ui/skeleton"

type Sort = "newest" | "price-asc" | "price-desc" | "yield" | "growth"

export default function PropertiesPage() {
  const router = useRouter()
  const { properties, ready, reset } = useProperties()
  const [q, setQ] = useState("")
  const [type, setType] = useState("all")
  const [sort, setSort] = useState<Sort>("newest")

  const types = useMemo(() => Array.from(new Set(properties.map((p) => p.type))), [properties])
  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const out = properties.filter((p) =>
      (type === "all" || p.type === type) &&
      (!term || `${p.address} ${p.neighborhood} ${p.type}`.toLowerCase().includes(term)))
    const key: Record<Sort, (a: typeof out[number], b: typeof out[number]) => number> = {
      newest: () => 0,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      yield: (a, b) => metricsFor(b).grossYield - metricsFor(a).grossYield,
      growth: (a, b) => b.growthRate - a.growthRate,
    }
    return [...out].sort(key[sort])
  }, [properties, q, type, sort])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-primary">Investment Properties</h2>
          <p className="text-muted-foreground">Your tracked properties. Add your own or compare the samples.</p>
        </div>
        <AddPropertyDialog onAdded={(id) => router.push(`/dashboard/properties/${id}`)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search properties" placeholder="Search city, address, neighborhood..." className="pl-10 bg-card" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-[190px] bg-card" aria-label="Filter by type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="sm:w-[190px] bg-card" aria-label="Sort"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="yield">Highest gross yield</SelectItem>
            <SelectItem value="growth">Highest growth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!ready ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[420px] rounded-xl" />)}</div>
      ) : list.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="py-16 text-center space-y-4">
            <Building2 className="w-12 h-12 mx-auto text-primary/30" />
            <p className="text-muted-foreground">{properties.length === 0 ? "No properties yet. Add your first one to see analytics." : "No properties match your filters."}</p>
            {properties.length === 0 && <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4 mr-2" />Load sample properties</Button>}
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{list.length} propert{list.length === 1 ? "y" : "ies"}</p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((prop) => {
              const m = metricsFor(prop)
              return (
                <Card key={prop.id} className="overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card flex flex-col">
                  <div className="relative h-52 sm:h-60 overflow-hidden">
                    <PropertyImage src={prop.image} alt={prop.address} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-3">
                      <Badge className="bg-primary text-white border-none">{prop.type}</Badge>
                      <Badge className="bg-accent text-white border-none gap-1"><TrendingUp className="w-3 h-3" />{prop.growthRate}% growth</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-md font-bold text-primary shadow-lg">{usd(prop.price)}</div>
                  </div>
                  <CardContent className="pt-4 space-y-3 flex-1">
                    <div className="flex items-start gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium line-clamp-2">{prop.address}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-y py-3 text-muted-foreground">
                      <div className="flex flex-col items-center gap-1"><BedDouble className="w-4 h-4 text-accent" /><span className="text-xs font-semibold">{prop.bedrooms} bed</span></div>
                      <div className="flex flex-col items-center gap-1 border-x"><Bath className="w-4 h-4 text-accent" /><span className="text-xs font-semibold">{prop.bathrooms} bath</span></div>
                      <div className="flex flex-col items-center gap-1"><Square className="w-4 h-4 text-accent" /><span className="text-xs font-semibold">{prop.sqft.toLocaleString()} sqft</span></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gross yield <b className="text-primary">{m.grossYield.toFixed(1)}%</b></span>
                      <span className="text-muted-foreground">Rent <b className="text-primary">{usd(prop.estimatedRent)}/mo</b></span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full font-headline"><Link href={`/dashboard/properties/${prop.id}`}>View analysis</Link></Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
