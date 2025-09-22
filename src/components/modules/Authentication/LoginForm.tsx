/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { initiateGoogleLogin } from "@/utils/googleAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [login] = useLoginMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const res = await login(data).unwrap();
      
      if (res.success) {
        // Check for redirection based on verification status
        if (res.data.user && !res.data.user.isVerified) {
          toast.info("Your account needs verification");
          navigate("/verify", { state: data.email });
        } else {
          toast.success("Logged in successfully");
          
          // Check if there's a specific redirect path in the response
          if (res.data.redirectTo) {
            navigate(res.data.redirectTo);
          } else {
            navigate("/");
          }
        }
      }
    } catch (err: any) {
      console.error(err);

      if (err.data?.message === "Password does not match") {
        toast.error("Invalid credentials");
      } else if (err.data?.message === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
      } else {
        toast.error(err.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    initiateGoogleLogin();
    // No need to reset loading state as we're navigating away
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-balance text-sm text-gray-600 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      autoComplete="email"
                      placeholder="john@example.com"
                      className="focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
                      {...field}
                      autoComplete="current-password"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200 dark:after:border-gray-700">
          <span className="relative z-10 bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>

        <Button
          onClick={handleGoogleLogin}
          type="button"
          variant="outline"
          className="w-full cursor-pointer border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            "Login with Google"
          )}
        </Button>
      </div>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="font-medium text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}