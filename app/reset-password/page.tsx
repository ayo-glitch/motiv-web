"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Password has been reset successfully");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setMessage(data.error || "Failed to reset password");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Reset Your Password</h1>
            <p className="text-gray-300">Enter your new password below</p>
          </div>

          {isSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-green-300 font-medium">Password Reset Successful!</p>
                <p className="text-gray-300 text-sm">
                  You will be redirected to the login page in a few seconds...
                </p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-300">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  isSuccess
                    ? "bg-green-900/20 border border-green-700 text-green-300"
                    : "bg-red-900/20 border border-red-700 text-red-300"
                }`}>
                  {isSuccess ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm text-[#D72638] hover:text-[#B91E2F] font-medium"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}