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
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/apis/apiGclient";

const SignupForm = () => {
  const { toast } = useToast();
  const isloading = false;
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const response = await axios.post(`${api}/auth/register`, values);
      console.log("data posted", response.data);
      if (response.data) {
        console.log(response.data.verificationCode);
        navigate(`/verify/${response.data._id}`);
      }
    } catch (error: any) {
      toast({
        duration: 2000,
        variant: "destructive",
        description: error?.response.data.error,
      });
      console.error("error posting data", error);
    }
  }
  return (
    <>
      <Form {...form}>
        <div className="sm:w-[653px] h-full flex justify-between items-center flex-col p-10">
          <div className="text-4xl font-bold text-primary">Moments</div>
          <div className="w-full flex justify-start flex-col gap-2">
            <div className="text-white text-xl">Create Account</div>
            <div className="text-white">
              Share your moments with your friends
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full"
          >
            <div className="flex w-full justify-between gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="FirstName"
                        className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="LastName"
                        className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="Email"
                      className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="UserName"
                      className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
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
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="password"
                      className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isloading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader />
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="border w-28 border-[#757575]" />

          <p className="text-sm text-primary">
            have an account?{" "}
            <Link
              to="/sign-in"
              className="border-b border-primary hover:border-0 transition-all cursor-pointer"
            >
              Log in
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
    </>
  );
};

export default SignupForm;
