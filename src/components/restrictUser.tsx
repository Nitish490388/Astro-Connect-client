import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchUser } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const RestrictUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Fetch user only if we don’t already have it
    dispatch(fetchUser());
  }, [dispatch, navigate]);

  useEffect(() => {
    // ✅ Redirect to login if fetching failed or user not found
    if (loading === "failed" || (!user && loading === "succeeded")) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // ✅ Optional: Loading state
  if (loading === "pending") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return <Outlet />;
};

export default RestrictUser;
