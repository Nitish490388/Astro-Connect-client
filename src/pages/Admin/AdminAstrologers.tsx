// src/pages/Admin/AdminAstrologers.tsx
import { useEffect, useState } from "react"
import axios from "axios"
import { AdminSidebar } from "@/components/adminSidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface Astrologer {
  id: number
  name: string
  expertise: string
  approved: boolean
}

export default function AdminAstrologers() {
  const [list, setList] = useState<Astrologer[]>([])

  useEffect(() => {
    axios.get("/api/admin/astrologers").then((res) => setList(res.data))
  }, [])

  const handleApprove = async (id: number) => {
    await axios.patch(`/api/admin/astrologers/${id}/approve`)
    toast.success("Astrologer approved")
    setList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, approved: true } : a))
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Manage Astrologers</h2>
        {list.map((a) => (
          <Card key={a.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.expertise}</p>
            </div>
            {a.approved ? (
              <span className="text-green-600 font-semibold">Approved</span>
            ) : (
              <Button onClick={() => handleApprove(a.id)}>Approve</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
