// src/components/AdminSidebar.tsx
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Star, Calendar, CreditCard } from "lucide-react"

export function AdminSidebar() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/astrologers", label: "Astrologers", icon: Star },
    { to: "/admin/appointments", label: "Appointments", icon: Calendar },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
  ]

  return (
    <aside className="w-60 h-screen border-r bg-card p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
