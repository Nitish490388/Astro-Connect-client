import { useState } from "react";
import axiosClient from "@/utils/axiosClient";
// Assuming you have a router component like Link available
// import { Link } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/user/dashboard";

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axiosClient.post("/api/v1/auth/login", formData);

      const token: string = response.data.result.token;
      localStorage.setItem("token", token);

      navigate(from);
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-78px)] flex items-center justify-center">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center text-xl font-semibold">
          Login 🔑
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Input for Email */}
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
            />

            {/* Input for Password */}
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />

            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Logging In..." : "Log In"}
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              // Add onClick handler for Google sign-in if needed
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </Button>
          </div>
        </CardContent>

        {/* Link back to Register */}
        <CardFooter className="flex justify-center text-sm pt-4">
          <p>
            Don't have an account?
            {/* Replace <a> with <Link> if using a router */}
            <Link
              to="/register"
              className="text-primary hover:underline ml-1 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
