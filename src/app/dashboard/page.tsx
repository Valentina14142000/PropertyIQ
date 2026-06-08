
"use client"

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  Building2, 
  DollarSign, 
  PieChart as PieChartIcon 
} from "lucide-react"

const performanceData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 67000 },
]

const yieldData = [
  { category: 'Residential', yield: 5.2 },
  { category: 'Commercial', yield: 6.8 },
  { category: 'Industrial', yield: 7.1 },
  { category: 'Multi-Family', yield: 5.9 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">$2,450,000</div>
            <p className="text-xs text-accent font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.5% from last year
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rental Yield</CardTitle>
            <PieChartIcon className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">6.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Above market average</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Units</CardTitle>
            <Building2 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">12</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 regions</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Cashflow</CardTitle>
            <DollarSign className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">$18,400</div>
            <p className="text-xs text-accent font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Portfolio Growth</CardTitle>
            <CardDescription>Estimated value appreciation over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip 
                   contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Yield by Sector</CardTitle>
            <CardDescription>Comparative rental yield across property types</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
                />
                <Bar dataKey="yield" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
