"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { KpiCard } from "@/components/dashboard/KpiCard"
import { DateRangePicker } from "@/components/dashboard/DateRangePicker"
import { SalesTrend } from "@/components/dashboard/SalesTrend"
import { TopProductsTable } from "@/components/dashboard/TopProductsTable"
import { SettlementsMiniChart } from "@/components/dashboard/SettlementsMiniChart"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { AlertsPanel } from "@/components/dashboard/AlertsPanel"
import { useToast } from "@/hooks/use-toast"
import { format, subDays } from "date-fns"
import { generateMockDashboardData } from "@/mocks/dashboard-data"
import { useMockData } from "@/hooks/useMockData"

interface DashboardData {
  totals: {
    sales_amount: number
    orders_count: number
    settled_amount: number
    influencer_rewards_paid: number
    today_sales: number
    month_sales: number
    deltas: {
      sales_amount_pct: number
      orders_count_pct: number
      settled_pct: number
      rewards_pct: number
      today_sales_pct: number
      month_sales_pct: number
    }
  }
  timeseries: {
    labels: string[]
    revenue: number[]
    orders: number[]
  }
  top_products: Array<{
    product_id: string
    title: string
    image: string
    units_sold: number
    gross_sales: number
    influencer_rewards: number
    net_to_brand: number
  }>
  settlements: { settled: number; pending: number }
  recent_orders: Array<{
    order_id: string
    date: string
    total: number
    status: "paid" | "pending" | "refunded" | "failed"
    customer_masked: string
  }>
  alerts: Array<{
    id: string
    type: "verification" | "low_stock" | "payout" | "general"
    message: string
    cta?: { label: string; href: string }
  }>
}

export default function SupplierDashboard() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 29),
    to: new Date(),
  })
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const mockData = useMockData()

  const fetchData = useCallback(
    async (from: Date, to: Date, attempt = 0) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      try {
        const fromISO = format(from, "yyyy-MM-dd")
        const toISO = format(to, "yyyy-MM-dd")

        let dashboardData: DashboardData

        if (mockData) {
          // Simulate network delay for mock data
          await new Promise((resolve) => setTimeout(resolve, 300))
          dashboardData = generateMockDashboardData(from, to)
        } else {
          const response = await fetch(`/api/brand/metrics?from=${fromISO}&to=${toISO}`, {
            signal: abortControllerRef.current.signal,
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          dashboardData = await response.json()
        }

        setData(dashboardData)
        setRetryCount(0) // Reset retry count on success
      } catch (error: any) {
        // Don't show error for aborted requests
        if (error.name === "AbortError") {
          return
        }

        console.error("Dashboard fetch error:", error)

        if (attempt < maxRetries) {
          const retryDelay = Math.pow(2, attempt) * 1000 // Exponential backoff
          setTimeout(() => {
            setRetryCount(attempt + 1)
            fetchData(from, to, attempt + 1)
          }, retryDelay)
          return
        }

        // Show error after max retries
        toast({
          title: "Error loading dashboard",
          description: `Failed to load dashboard data after ${maxRetries} attempts. Please try again.`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast, maxRetries, mockData],
  )

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const handleDateRangeChange = useCallback(
    (newRange: { from: Date; to: Date }) => {
      setDateRange(newRange)

      // Persist to localStorage
      localStorage.setItem(
        "dashboard-date-range",
        JSON.stringify({
          from: newRange.from.toISOString(),
          to: newRange.to.toISOString(),
        }),
      )

      // Update URL params
      const url = new URL(window.location.href)
      url.searchParams.set("from", format(newRange.from, "yyyy-MM-dd"))
      url.searchParams.set("to", format(newRange.to, "yyyy-MM-dd"))
      window.history.replaceState({}, "", url.toString())

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(() => {
        fetchData(newRange.from, newRange.to)
      }, 500)
    },
    [fetchData],
  )

  // Initial data load
  useEffect(() => {
    fetchData(dateRange.from, dateRange.to)

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, []) // Only run on mount

  // Load persisted date range on mount
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-date-range")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const newRange = {
          from: new Date(parsed.from),
          to: new Date(parsed.to),
        }
        setDateRange(newRange)
      } catch (error) {
        console.error("Failed to parse saved date range:", error)
      }
    }

    // Check URL params
    const url = new URL(window.location.href)
    const fromParam = url.searchParams.get("from")
    const toParam = url.searchParams.get("to")
    if (fromParam && toParam) {
      const newRange = {
        from: new Date(fromParam),
        to: new Date(toParam),
      }
      setDateRange(newRange)
    }
  }, [])

  const handleExportCSV = async () => {
    if (!data) return

    setIsExporting(true)
    try {
      // Create CSV content
      const csvData = {
        kpis: data.totals,
        timeseries: data.timeseries.labels.map((label, index) => ({
          date: label,
          revenue: data.timeseries.revenue[index],
          orders: data.timeseries.orders[index],
        })),
        top_products: data.top_products,
      }

      const csvContent = [
        "Dashboard Export - One-Link",
        `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
        `Date Range: ${format(dateRange.from, "yyyy-MM-dd")} to ${format(dateRange.to, "yyyy-MM-dd")}`,
        "",
        "KPI Summary",
        "Metric,Value,Change %",
        `Total Sales,₩${data.totals.sales_amount.toLocaleString()},${data.totals.deltas.sales_amount_pct}%`,
        `Total Orders,${data.totals.orders_count},${data.totals.deltas.orders_count_pct}%`,
        `Settled Amount,₩${data.totals.settled_amount.toLocaleString()},${data.totals.deltas.settled_pct}%`,
        `Influencer Rewards,₩${data.totals.influencer_rewards_paid.toLocaleString()},${data.totals.deltas.rewards_pct}%`,
        `Today's Sales,₩${data.totals.today_sales.toLocaleString()},${data.totals.deltas.today_sales_pct}%`,
        `This Month's Sales,₩${data.totals.month_sales.toLocaleString()},${data.totals.deltas.month_sales_pct}%`,
        "",
        "Daily Sales Data",
        "Date,Revenue (KRW),Orders",
        ...data.timeseries.labels.map(
          (date, index) => `${date},${data.timeseries.revenue[index]},${data.timeseries.orders[index]}`,
        ),
        "",
        "Top Products",
        "Product,Units Sold,Gross Sales (KRW),Influencer Rewards (KRW),Net to Brand (KRW)",
        ...data.top_products.map(
          (p) => `"${p.title}",${p.units_sold},${p.gross_sales},${p.influencer_rewards},${p.net_to_brand}`,
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `onelink-dashboard-${format(dateRange.from, "yyyy-MM-dd")}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export completed",
        description: "Dashboard data has been exported to CSV.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "Failed to export dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleRefresh = useCallback(() => {
    fetchData(dateRange.from, dateRange.to)
  }, [fetchData, dateRange.from, dateRange.to])

  // Format currency for KPI cards
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Prepare chart data
  const chartData =
    data?.timeseries.labels.map((label, index) => ({
      date: label,
      revenue: data.timeseries.revenue[index],
      orders: data.timeseries.orders[index],
    })) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your sales performance and business metrics
            {retryCount > 0 && (
              <span className="ml-2 text-amber-600 text-sm">
                (Retrying... {retryCount}/{maxRetries})
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <div className="flex gap-2">
            <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm" className="bg-transparent">
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
            <Button
              onClick={handleExportCSV}
              disabled={isExporting || !data}
              variant="outline"
              className="bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Download CSV"}
            </Button>
          </div>
        </div>
      </div>

      {/* ... existing code for KPI cards, charts, and other components ... */}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label="Total Sales Amount"
          value={data ? formatCurrency(data.totals.sales_amount) : "₩0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.sales_amount_pct,
                  isPositive: data.totals.deltas.sales_amount_pct >= 0,
                }
              : undefined
          }
          sparklineData={data?.timeseries.revenue}
          testId="kpi-sales"
        />
        <KpiCard
          label="Total Orders"
          value={data ? data.totals.orders_count.toLocaleString() : "0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.orders_count_pct,
                  isPositive: data.totals.deltas.orders_count_pct >= 0,
                }
              : undefined
          }
          sparklineData={data?.timeseries.orders}
          testId="kpi-orders"
        />
        <KpiCard
          label="Total Settled"
          value={data ? formatCurrency(data.totals.settled_amount) : "₩0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.settled_pct,
                  isPositive: data.totals.deltas.settled_pct >= 0,
                }
              : undefined
          }
          testId="kpi-settled"
        />
        <KpiCard
          label="Influencer Rewards Paid"
          value={data ? formatCurrency(data.totals.influencer_rewards_paid) : "₩0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.rewards_pct,
                  isPositive: data.totals.deltas.rewards_pct >= 0,
                }
              : undefined
          }
          testId="kpi-rewards"
        />
        <KpiCard
          label="Today's Sales"
          value={data ? formatCurrency(data.totals.today_sales) : "₩0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.today_sales_pct,
                  isPositive: data.totals.deltas.today_sales_pct >= 0,
                }
              : undefined
          }
        />
        <KpiCard
          label="This Month's Sales"
          value={data ? formatCurrency(data.totals.month_sales) : "₩0"}
          delta={
            data
              ? {
                  value: data.totals.deltas.month_sales_pct,
                  isPositive: data.totals.deltas.month_sales_pct >= 0,
                }
              : undefined
          }
        />
      </div>

      {/* Sales Trend Chart */}
      <SalesTrend data={chartData} isLoading={isLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          <TopProductsTable products={data?.top_products || []} isLoading={isLoading} />
          <RecentOrders orders={data?.recent_orders || []} isLoading={isLoading} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          <SettlementsMiniChart
            settled={data?.settlements.settled || 0}
            pending={data?.settlements.pending || 0}
            isLoading={isLoading}
          />
          <AlertsPanel alerts={data?.alerts || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
