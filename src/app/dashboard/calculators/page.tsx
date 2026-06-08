
"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  Calculator, 
  Home, 
  Percent, 
  DollarSign, 
  Info,
  TrendingUp,
  Receipt
} from "lucide-react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from "recharts"

export default function CalculatorsPage() {
  // ROI Calculator State
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [monthlyRent, setMonthlyRent] = useState(3000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(800)
  
  // ROI Calculations
  const downPayment = purchasePrice * (downPaymentPct / 100)
  const annualCashFlow = (monthlyRent - monthlyExpenses) * 12
  const cashOnCash = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0

  // Mortgage Calculator State
  const [loanAmount, setLoanAmount] = useState(320000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  
  // Mortgage Calculations
  const monthlyRate = interestRate / 100 / 12
  const numberOfPayments = loanTerm * 12
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const pieData = [
    { name: "Principal & Interest", value: monthlyPayment, color: "hsl(var(--primary))" },
    { name: "Taxes & Insurance (Est)", value: monthlyPayment * 0.2, color: "hsl(var(--accent))" },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-headline font-bold text-primary">Financial Simulators</h2>
        <p className="text-muted-foreground">Plan your next move with our precision calculators.</p>
      </div>

      <Tabs defaultValue="roi" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="roi" className="rounded-lg px-8 py-2 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="mortgage" className="rounded-lg px-8 py-2 font-headline data-[state=active]:bg-primary data-[state=active]:text-white">
            Mortgage Simulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roi" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-md border-none">
              <CardHeader>
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                  <Home className="w-5 h-5 text-accent" /> Purchase Details
                </CardTitle>
                <CardDescription>Enter basic property cost details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="price">Purchase Price</Label>
                    <span className="font-bold text-primary">${purchasePrice.toLocaleString()}</span>
                  </div>
                  <Slider 
                    value={[purchasePrice]} 
                    min={50000} 
                    max={2000000} 
                    step={10000}
                    onValueChange={(val) => setPurchasePrice(val[0])}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="downpayment">Down Payment (%)</Label>
                    <span className="font-bold text-primary">{downPaymentPct}%</span>
                  </div>
                  <Slider 
                    value={[downPaymentPct]} 
                    min={0} 
                    max={100} 
                    step={1}
                    onValueChange={(val) => setDownPaymentPct(val[0])}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="rent">Monthly Rent</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="rent" 
                        type="number" 
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Monthly Expenses</Label>
                    <div className="relative">
                      <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="expenses" 
                        type="number" 
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-primary text-white border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline text-white/90">Estimated ROI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-white/70">Cash-on-Cash Return</p>
                      <h3 className="text-5xl font-bold font-headline mt-1">
                        {cashOnCash.toFixed(2)}%
                      </h3>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="w-10 h-10 text-accent" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-white/60">Annual Cashflow</p>
                      <p className="text-xl font-bold font-headline">${annualCashFlow.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Cash Invested</p>
                      <p className="text-xl font-bold font-headline">${downPayment.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <Info className="w-5 h-5 text-accent shrink-0" />
                    <p>
                      ROI calculations are estimates based on standard market data. Actual returns may vary due to maintenance, vacancy rates, and financing costs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mortgage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-md border-none">
              <CardHeader>
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-accent" /> Loan Parameters
                </CardTitle>
                <CardDescription>Adjust sliders to simulate scenarios.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Loan Amount</Label>
                    <span className="font-bold text-primary">${loanAmount.toLocaleString()}</span>
                  </div>
                  <Slider 
                    value={[loanAmount]} 
                    min={10000} 
                    max={1500000} 
                    step={5000}
                    onValueChange={(v) => setLoanAmount(v[0])}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Interest Rate (%)</Label>
                    <span className="font-bold text-primary">{interestRate}%</span>
                  </div>
                  <Slider 
                    value={[interestRate]} 
                    min={1} 
                    max={15} 
                    step={0.1}
                    onValueChange={(v) => setInterestRate(v[0])}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Loan Term (Years)</Label>
                    <span className="font-bold text-primary">{loanTerm} Years</span>
                  </div>
                  <Slider 
                    value={[loanTerm]} 
                    min={5} 
                    max={40} 
                    step={5}
                    onValueChange={(v) => setLoanTerm(v[0])}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="font-headline text-primary">Monthly Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">Total Monthly Payment</p>
                  <h3 className="text-4xl font-bold font-headline text-primary mt-1">
                    ${(monthlyPayment * 1.2).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </h3>
                </div>

                <div className="w-full mt-8 space-y-3">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-bold">${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
