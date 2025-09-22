import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state);
  const [confirmed, setConfirmed] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [sendOtp] = useSendOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [timer, setTimer] = useState(5);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSendOtp = async () => {
    // loading sending toast => { id: toastId} //!
    const toastId = toast.loading("sending OTP");

    try {
      const res = await sendOtp({ email: email }).unwrap();
      if (res.success) {
        toast.success("OTP Send", { id: toastId });
        setConfirmed(true);
        setTimer(120);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to send OTP", { id: toastId });
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const toastId = toast.loading("Verifying OTP");
    const userInfo = {
      email,
      otp: data.pin,
    };
    try {
      const res = await verifyOtp(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP Verified", { id: toastId });
        setConfirmed(true);
        setIsVerified(true);
        
        // Show success message and redirect to homepage after a short delay
        setTimeout(() => {
          toast.success("Logged in successfully");
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      toast.error("Verification failed", { id: toastId });
    }
  };

  // ! Needed
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email || !confirmed) {
      return;
    }

    const timerId = setInterval(() => {
      if (email && confirmed) {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        console.log("Task:");
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [email, confirmed]);

  return (
    <div className="grid place-content-center h-screen">
      {/* opt confirm */}
      {confirmed ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isVerified ? "Verification Successful!" : "Verify your email address"}
            </CardTitle>
            <CardDescription>
              email: <span className="font-semibold">{email}</span>
              {isVerified && (
                <p className="mt-2 text-green-600 font-medium">
                  Your account has been verified successfully.
                  Redirecting to homepage...
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* OTP card */}
            <Form {...form}>
              <form
                id="otp-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-center justify-center items-center">
                        Enter code
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field} disabled={isVerified}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            {/* <Dot /> */}
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        {/* reset OTP */}
                        <Button
                          onClick={handleSendOtp}
                          type="button"
                          variant="link"
                          disabled={timer !== 0 || isVerified}
                          className={cn("p-0 m-0", {
                            "cursor-pointer": timer === 0 && !isVerified,
                            "text-gray-500": timer !== 0 || isVerified,
                          })}
                        >
                          Resent OTP:
                        </Button>{" "}
                        {!isVerified && timer}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              form="otp-form" 
              type="submit"
              disabled={isVerified}
            >
              {isVerified ? "Verified" : "Verify"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {" "}
              Verify your email address
            </CardTitle>
            <CardDescription>
              email: <span className="font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex-col gap-2">
            <Button onClick={handleSendOtp} className="w-[360px]">
              {" "}
              Send OTP{" "}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Verify;
