import { useState } from "react"
import axiosClient from "@/utils/axiosClient"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

interface FormData {
  email: string;
  password: string;
}

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async () => {
    setLoading(true);

    try {
      
      const response = await axiosClient.post("/api/v1/auth/register", formData);
      console.log("Registration Success:", response.data.result);
      
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-78px)] flex items-center justify-center">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center text-xl font-semibold">
          Create Account
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
            
            {/* Sign Up Button */}
            <Button onClick={handleSignup} disabled={loading} className="w-full">
              {loading ? "Creating..." : "Sign Up"}
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
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
        {/* New Login Link Added */}
        <CardFooter className="flex justify-center text-sm pt-4">
          <p>
            Already have an account? 
            {/* Replace <a> with <Link> if using a router */}
            <Link to="/login" className="text-primary hover:underline ml-1 font-medium">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}