"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Wallet, 
  Eye,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { useHostDashboard, useMonthlyRevenue, useMyEvents } from "@/lib/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HostAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const currentYear = new Date().getFullYear();

  // Fetch data
  const { data: dashboardStats, isLoading: statsLoading } = useHostDashboard();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyRevenue(currentYear);
  const { data: eventsData, isLoading: eventsLoading } = useMyEvents();

  const events = eventsData?.data ?? [];
  const monthlyRevenue = monthlyData?.data ?? [];

  // Calculate overview metrics
  const overviewMetrics = [
    {
      title: "Total Revenue",
      value: dashboardStats ? `₦${dashboardStats.total_revenue.toLocaleString()}` : "₦0",
      change: dashboardStats?.revenue_change ? `${dashboardStats.revenue_change > 0 ? '+' : ''}${dashboardStats.revenue_change}%` : "0%",
      trend: dashboardStats?.revenue_change >= 0 ? "up" : "down",
      icon: Wallet,
      period: "vs last month"
    },
    {
      title: "Total Events",
      value: dashboardStats ? dashboardStats.total_events.toString() : "0",
      change: dashboardStats?.events_change ? `${dashboardStats.events_change > 0 ? '+' : ''}${dashboardStats.events_change}%` : "0%",
      trend: dashboardStats?.events_change >= 0 ? "up" : "down",
      icon: Calendar,
      period: "vs last month"
    },
    {
      title: "Total Attendees",
      value: dashboardStats ? dashboardStats.total_attendees.toLocaleString() : "0",
      change: dashboardStats?.attendees_change ? `${dashboardStats.attendees_change > 0 ? '+' : ''}${dashboardStats.attendees_change}%` : "0%",
      trend: dashboardStats?.attendees_change >= 0 ? "up" : "down",
      icon: Users,
      period: "vs last month"
    },
    {
      title: "Page Views",
      value: dashboardStats ? dashboardStats.total_views?.toLocaleString() || "0" : "0",
      change: dashboardStats?.views_change ? `${dashboardStats.views_change > 0 ? '+' : ''}${dashboardStats.views_change}%` : "0%",
      trend: dashboardStats?.views_change >= 0 ? "up" : "down",
      icon: Eye,
      period: "vs last month"
    }
  ];

  // Get top performing events (sorted by revenue or attendees)
  const topEvents = events
    .filter(event => event.status === 'completed' || event.status === 'active')
    .sort((a, b) => (b.attendee_count || 0) - (a.attendee_count || 0))
    .slice(0, 4);
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your event performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          overviewMetrics.map((item, index) => {
            const Icon = item.icon;
            const isPositive = item.trend === "up";
            
            return (
              <Card key={index} className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {item.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {item.value}
                  </div>
                  <div className="flex items-center text-xs">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                    )}
                    <span className={isPositive ? "text-green-600" : "text-red-600"}>
                      {item.change}
                    </span>
                    <span className="text-gray-500 ml-1">{item.period}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading chart...</span>
              </div>
            ) : monthlyRevenue.length > 0 ? (
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyRevenue.slice(-6).map((data, index) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 200 : 20;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-[#D72638] rounded-t-sm"
                        style={{ 
                          height: `${height}px`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs text-gray-600 mt-2">
                        {new Date(0, data.month - 1).toLocaleDateString('en', { month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendees Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Attendees Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading chart...</span>
              </div>
            ) : monthlyRevenue.length > 0 ? (
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyRevenue.slice(-6).map((data, index) => {
                  const maxAttendees = Math.max(...monthlyRevenue.map(d => d.attendees));
                  const height = maxAttendees > 0 ? (data.attendees / maxAttendees) * 200 : 20;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm"
                        style={{ 
                          height: `${height}px`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs text-gray-600 mt-2">
                        {new Date(0, data.month - 1).toLocaleDateString('en', { month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No attendee data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          ) : topEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">EVENT NAME</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">DATE</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">ATTENDEES</th>
                    <th className="text-left py-3 px-3 sm:px-4 font-medium text-gray-600 text-xs sm:text-sm">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 font-medium">
                        {event.title}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                        {new Date(event.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600">
                        {(event.attendee_count || 0).toLocaleString()}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'active' ? 'bg-green-100 text-green-800' :
                          event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No events data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}