"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProperties } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

const TYPES = ["Single-Family Home", "Condo", "Townhouse", "Multi-Family", "Commercial", "Land"]

const blank = { address: "", price: "", type: TYPES[0], bedrooms: "3", bathrooms: "2", sqft: "", yearBuilt: "", rent: "", growth: "4", neighborhood: "", description: "", image: "" }

export function AddPropertyDialog({ onAdded }: { onAdded?: (id: string) => void }) {
  const { add } = useProperties()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(blank)
  const [error, setError] = useState("")
  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const price = Number(f.price), rent = Number(f.rent), sqft = Number(f.sqft), year = Number(f.yearBuilt)
    if (f.address.trim().length < 3) return setError("Enter the property address.")
    if (!(price > 0)) return setError("Enter a purchase price greater than 0.")
    if (!(rent >= 0) || f.rent === "") return setError("Enter the estimated monthly rent (0 if none).")
    if (!(sqft > 0)) return setError("Enter the size in square feet.")
    if (!(year >= 1600 && year <= new Date().getFullYear() + 3)) return setError("Enter a valid year built.")
    if (f.image && !/^https?:\/\//i.test(f.image.trim())) return setError("Image must be a link starting with http:// or https://")
    const id = add({
      address: f.address.trim(),
      price,
      type: f.type,
      bedrooms: Number(f.bedrooms) || 0,
      bathrooms: Number(f.bathrooms) || 0,
      sqft,
      yearBuilt: year,
      description: f.description.trim() || `${f.type} at ${f.address.trim()}.`,
      neighborhood: f.neighborhood.trim() || "Neighborhood details not provided",
      image: f.image.trim(),
      estimatedRent: rent,
      growthRate: Number(f.growth) || 0,
    })
    toast({ title: "Property added", description: f.address.trim() })
    setF(blank); setError(""); setOpen(false)
    onAdded?.(id)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setError("") }}>
      <DialogTrigger asChild>
        <Button className="font-headline gap-2"><Plus className="w-4 h-4" /> Add property</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Add a property</DialogTitle>
          <DialogDescription>It is saved in this browser and included in your dashboard and AI analysis.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5"><Label htmlFor="address">Address</Label><Input id="address" value={f.address} onChange={set("address")} placeholder="12 Oak Street, Denver, CO" maxLength={200} /></div>
          <div className="space-y-1.5"><Label htmlFor="price">Purchase price (USD)</Label><Input id="price" type="number" inputMode="decimal" min="0" value={f.price} onChange={set("price")} /></div>
          <div className="space-y-1.5"><Label htmlFor="rent">Estimated monthly rent (USD)</Label><Input id="rent" type="number" inputMode="decimal" min="0" value={f.rent} onChange={set("rent")} /></div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={f.type} onValueChange={(v) => setF((s) => ({ ...s, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="growth">Expected yearly growth (%)</Label><Input id="growth" type="number" step="0.1" value={f.growth} onChange={set("growth")} /></div>
          <div className="space-y-1.5"><Label htmlFor="beds">Bedrooms</Label><Input id="beds" type="number" min="0" value={f.bedrooms} onChange={set("bedrooms")} /></div>
          <div className="space-y-1.5"><Label htmlFor="baths">Bathrooms</Label><Input id="baths" type="number" min="0" step="0.5" value={f.bathrooms} onChange={set("bathrooms")} /></div>
          <div className="space-y-1.5"><Label htmlFor="sqft">Size (sq ft)</Label><Input id="sqft" type="number" min="0" value={f.sqft} onChange={set("sqft")} /></div>
          <div className="space-y-1.5"><Label htmlFor="year">Year built</Label><Input id="year" type="number" value={f.yearBuilt} onChange={set("yearBuilt")} /></div>
          <div className="sm:col-span-2 space-y-1.5"><Label htmlFor="hood">Neighborhood notes (optional)</Label><Input id="hood" value={f.neighborhood} onChange={set("neighborhood")} placeholder="Near transit, strong rental demand" maxLength={300} /></div>
          <div className="sm:col-span-2 space-y-1.5"><Label htmlFor="desc">Description (optional)</Label><Textarea id="desc" value={f.description} onChange={set("description")} rows={3} maxLength={1500} /></div>
          <div className="sm:col-span-2 space-y-1.5"><Label htmlFor="img">Photo link (optional)</Label><Input id="img" value={f.image} onChange={set("image")} placeholder="https://..." /></div>
          {error && <p role="alert" className="sm:col-span-2 text-sm text-destructive">{error}</p>}
          <DialogFooter className="sm:col-span-2"><Button type="submit" className="font-headline">Save property</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
