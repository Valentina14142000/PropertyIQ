
export interface Property {
  id: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  description: string;
  neighborhood: string;
  image: string;
  estimatedRent: number;
  growthRate: number;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    address: "742 Evergreen Terrace, Springfield",
    price: 450000,
    type: "Single-Family Home",
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 2200,
    yearBuilt: 1989,
    description: "Spacious family home in a quiet neighborhood. Large backyard, attached garage, and updated kitchen. Perfect for long-term rental or primary residence.",
    neighborhood: "West Springfield - High demand for family rentals.",
    image: "https://picsum.photos/seed/prop1/800/600",
    estimatedRent: 3200,
    growthRate: 4.5
  },
  {
    id: "2",
    address: "123 Skyline Blvd, Austin",
    price: 675000,
    type: "Luxury Condo",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    yearBuilt: 2021,
    description: "Modern downtown condo with panoramic city views. Floor-to-ceiling windows, premium appliances, and building amenities including a rooftop pool and gym.",
    neighborhood: "Downtown Austin - Rapid appreciation area.",
    image: "https://picsum.photos/seed/prop2/800/600",
    estimatedRent: 4500,
    growthRate: 8.2
  },
  {
    id: "3",
    address: "88 Industrial Way, Brooklyn",
    price: 1200000,
    type: "Multi-Family Loft",
    bedrooms: 6,
    bathrooms: 4,
    sqft: 3500,
    yearBuilt: 1920,
    description: "Renovated warehouse loft converted into three 2-bedroom units. Original brickwork and high ceilings. Strong historical occupancy rates.",
    neighborhood: "Bushwick - Emerging tech hub, high rental yield.",
    image: "https://picsum.photos/seed/prop3/800/600",
    estimatedRent: 9500,
    growthRate: 6.0
  },
  {
    id: "4",
    address: "45 Maple Avenue, Raleigh",
    price: 325000,
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1650,
    yearBuilt: 2015,
    description: "End-unit townhouse in a manicured community. Close to Research Triangle Park. Low maintenance with HOA covering exterior upkeep.",
    neighborhood: "Raleigh-Durham - Consistent job growth.",
    image: "https://picsum.photos/seed/prop4/800/600",
    estimatedRent: 2100,
    growthRate: 5.1
  }
];
