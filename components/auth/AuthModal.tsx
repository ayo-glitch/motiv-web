"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, User, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void; // Optional callback for successful authentication
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const {
    login,
    signup,
    googleAuth,
    isLoggingIn,
    isSigningUp,
    isGoogleAuthenticating,
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "host" as "host" | "guest" | "admin" | "superhost", // Default role - hidden from UI
  });

  const isLoading = isLoggingIn || isSigningUp || isGoogleAuthenticating;
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleAuth = async () => {
    try {
      await googleAuth();
      // Call success callback if provided
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      // Only close modal on successful Google auth
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      // Don't close modal on error - let user try again
      console.error("Google auth error:", error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
        // Call success callback if provided*
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        // Close modal on successful login
        onClose();
        // Reset form
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "host" as "host" | "guest" | "admin" | "superhost",
        });
      } else {
        // Wait for signup to complete before closing modal
        await signup({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        });
        // Call success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess();
        }
        // Only close modal if signup was successful
        onClose();
        // Reset form
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "host" as "host" | "guest" | "admin" | "superhost",
        });
      }
    } catch (error) {
      // Error handling is done in the hook
      // Don't close modal on error - let user try again
      console.error("Auth error:", error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setForgotPasswordMessage("");
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "host" as "host" | "guest" | "admin" | "superhost",
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage(data.message || "Password reset link sent to your email");
      } else {
        setForgotPasswordMessage(data.error || "Failed to send reset email");
      }
    } catch (error) {
      setForgotPasswordMessage("Network error. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setIsForgotPassword(false);
    setForgotPasswordMessage("");
    setFormData(prev => ({ ...prev, email: "" }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing modal while loading
      if (!open && isLoading) {
        return;
      }
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[400px] bg-[#1a1a1a] border-gray-700 [&>button]:text-white [&>button]:hover:text-gray-300">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            {isForgotPassword && (
              <button
                onClick={resetForgotPassword}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {isForgotPassword 
              ? "Reset Password" 
              : isLogin 
                ? "Welcome Back" 
                : "Join MOTIV"
            }
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isForgotPassword
              ? "Enter your email to receive a password reset link"
              : isLogin
                ? "Sign in to your account to continue"
                : "Create an account to discover amazing events"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Forgot Password Form */}
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300"
                >
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {forgotPasswordMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  forgotPasswordMessage.includes("sent") || forgotPasswordMessage.includes("success")
                    ? "bg-green-900/20 border border-green-700 text-green-300"
                    : "bg-red-900/20 border border-red-700 text-red-300"
                }`}>
                  {forgotPasswordMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3"
              >
                {forgotPasswordLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resetForgotPassword}
                  className="text-sm text-[#D72638] hover:text-[#B91E2F] font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Google Sign In */}
              <Button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                variant="outline"
                className="w-full py-3 border-gray-600 text-black hover:bg-gray-800 hover:text-white"
              >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleAuthenticating ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1a1a1a] px-2 text-gray-400">Or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-300"
                  >
                    Username
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      @
                    </span>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required={!isLogin}
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-8 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                      placeholder="Choose a username"
                      minLength={3}
                      maxLength={30}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                  placeholder="Enter your password"
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

            {!isLogin && (
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#D72638] focus:ring-[#D72638]"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-[#D72638] hover:text-[#B91E2F] font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="text-xs text-gray-400 text-center mb-4">
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D72638] hover:text-[#B91E2F] underline"
                >
                  Terms and Conditions
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D72638] hover:bg-[#B91E2F] text-white py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

              <div className="text-center">
                <button
                  onClick={toggleMode}
                  disabled={isLoading}
                  className={`text-sm font-medium ${
                    isLoading 
                      ? "text-gray-500 cursor-not-allowed" 
                      : "text-[#D72638] hover:text-[#B91E2F]"
                  }`}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}

          {/* MVP Notice */}
          {/* <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              <strong>Demo:</strong> Use any email/password or Google sign-in to
              continue
            </p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
