import { navItems } from "@/lib/navItems";
import { Link, useNavigate } from "react-router-dom";
import DrawerBTN from "./drawer";
import { ModeToggle } from "./mode-toggle";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser, fetchUser } from "@/store/slices/userSlice";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const NewHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, loading, error } = useAppSelector((state) => state.user);

  // ✅ Derived state
  const isLoggedIn = !!user;
  let userRole = user?.role || null;

  if(user?.astrologer) {
    userRole = "ASTROLOGER"  
  }
 

  // ✅ On mount, ensure we have user (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

  // ✅ Public nav items (visible for everyone)
  const publicNav = navItems.filter(
    (item) => item.for === "public" || !item.for
  );

  // ✅ Handle loading or error states
  if (loading === "pending") {
    return (
      <header className="w-full bg-secondary/30 border-b border-secondary/20 shadow-md py-2 fixed top-0 left-0 z-50">
        <div className="flex items-center justify-center py-4 text-primary">
          Checking user...
        </div>
      </header>
    );
  }

  if (error && !isLoggedIn) {
    return (
      <header className="w-full bg-secondary/30 border-b border-secondary/20 shadow-md py-2 fixed top-0 left-0 z-50">
        <div className="flex items-center justify-center py-4 text-red-500">
          Failed to load user data
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-secondary/30 backdrop-blur-sm border-b border-secondary/20 shadow-md py-2 fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-10">
        {/* Brand */}
        <Link
          to="/"
          className="font-bold text-primary text-2xl md:text-3xl font-roboto select-none"
        >
          Astro Connect
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 font-semibold text-primary">
          {/* Public pages */}
          {publicNav.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="hover:text-primary/60 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}

          {/* Auth / Role Section */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/80 transition"
            >
              Login
            </Link>
          ) : (
            <>
              {userRole === "USER" && (
                <Link
                  to="/user/dashboard"
                  className="hover:text-primary/60 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}
              {userRole === "ASTROLOGER" && (
                <Link
                  to="/astro/dashboard"
                  className="hover:text-primary/60 transition-colors duration-200"
                >
                  Astro Panel
                </Link>
              )}
              {userRole === "ADMIN" && (
                <Link
                  to="/admin/dashboard"
                  className="hover:text-primary/60 transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              )}
                <Button 
                variant={"destructive"}
                onClick={handleLogout}
                size="icon">
                  <LogOut/></Button>
            </>
          )}

          {/* Theme Toggle */}
          <div className="flex gap-3 items-center">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <DrawerBTN />
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
