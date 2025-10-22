// src/pages/Admin/AdminDashboard.tsx
import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/adminSidebar"

interface Stats {
  users: number
  astrologers: number
  appointments: number
  payments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    axios
      .get("/api/admin/overview")
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to load stats"))
  }, [])

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats ? (
          Object.entries(stats).map(([key, value]) => (
            <Card key={key} className="shadow-sm">
              <CardHeader>
                <CardTitle className="capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{value}</CardContent>
            </Card>
          ))
        ) : (
          <p>Loading dashboard...</p>
        )}
      </div>
    </div>
  )
}
