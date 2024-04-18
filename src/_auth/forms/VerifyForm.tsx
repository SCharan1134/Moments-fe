import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const loginDetails = z.object({
  recievedverification: z
    .string()
    .min(6, { message: "otp must be atleast 6 characters" }),
});

const VerifyForm = () => {
  const { userId } = useParams();
  const isloading = false;
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginDetails>>({
    resolver: zodResolver(loginDetails),
    defaultValues: {
      recievedverification: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginDetails>) {
    try {
      console.log(values);
      const response = await axios.post(
        `http://localhost:3001/auth/verify/${userId}`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.isValid) {
        console.log("verified succesfully");
        navigate("/sign-in");
      } else {
        console.log("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: "error in log in",
      });

      console.error("error posting data", error);
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-[653px] h-full flex justify-between items-center flex-col p-10">
        <div className="text-4xl font-bold text-primary">Moments</div>
        <div className="w-full flex justify-start flex-col gap-2">
          <div className="text-white text-xl">Check Your Inbox</div>
          <div className="text-white">
            OTP has shared to your entered email address
          </div>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="recievedverification"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-[#363536] border-[#494949] text-[#8B8B8B] "
                    type="recievedverification"
                    {...field}
                    placeholder="otp"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="py-3 text-lg mt-5">
            {isloading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader />
              </div>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        <div className="border w-28 border-[#757575]" />
        <p className="text-sm text-primary">
          check the email address?{" "}
          <Link
            to="/sign-up"
            className="border-b border-primary hover:border-0 transition-all cursor-pointer"
          >
            Go back
          </Link>
        </p>
        <p className="text-sm text-white font-light mt-2">
          By signing up, you agree to our{" "}
          <span className="border-b border-white hover:border-0 transition-all cursor-pointer">
            Terms
          </span>{" "}
          ,
          <span className="border-b border-white hover:border-0 transition-all cursor-pointer">
            Privacy Policy
          </span>{" "}
          and
          <span className="border-b border-white hover:border-0 transition-all cursor-pointer">
            Cookies Policy{" "}
          </span>
          .
        </p>
      </div>
    </Form>
  );
};

export default VerifyForm;
