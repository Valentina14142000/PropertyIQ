
"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card"
import { 
  BedDouble, 
  Bath, 
  Square, 
  MapPin, 
  TrendingUp,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { mockProperties } from "@/lib/mock-data"

export default function PropertiesPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Investment Properties</h2>
          <p className="text-muted-foreground">Hand-picked opportunities for high yield and growth.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search city, neighborhood..." 
            className="pl-10 w-full md:w-[300px] bg-white border-muted shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {mockProperties.map((prop) => (
          <Card key={prop.id} className="overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            <div className="relative h-64 overflow-hidden">
              <Image 
                src={prop.image} 
                alt={prop.address}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint="property house"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary text-white border-none">{prop.type}</Badge>
                <Badge className="bg-accent text-white border-none flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {prop.growthRate}% Growth
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/95 backdrop-blur px-3 py-1 rounded-md font-bold text-primary shadow-lg">
                  ${prop.price.toLocaleString()}
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start gap-1 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span className="text-sm font-medium line-clamp-1">{prop.address}</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-primary leading-tight line-clamp-1">
                {prop.neighborhood.split('-')[0]} Opportunity
              </h3>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-3 gap-2 border-y py-3 text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <BedDouble className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">{prop.bedrooms} Bed</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x">
                  <Bath className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">{prop.bathrooms} Bath</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Square className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold">{prop.sqft} sqft</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                {prop.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full font-headline bg-primary hover:bg-primary/90 text-white rounded-lg">
                <Link href={`/dashboard/properties/${prop.id}`}>View Analysis Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
