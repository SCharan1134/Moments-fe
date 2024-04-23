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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogin } from "@/state";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/apis/apiGclient";

const loginDetails = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters" }),
});

const signinForm = () => {
  const dispatch = useDispatch();
  const isloading = false;
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof loginDetails>>({
    resolver: zodResolver(loginDetails),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginDetails>) {
    try {
      const loggedInResponse = await axios.post(`${api}/auth/login`, values, {
        headers: { "Content-Type": "application/json" },
      });
      const loggedIn = loggedInResponse.data;
      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        toast({
          duration: 2000,
          description: "log in successfully",
        });
        navigate("/home");
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
      <div className="w-full h-full flex justify-between items-center flex-col p-10">
        <div className="text-4xl font-bold text-primary">Moments</div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="bg-[#363536] border-[#494949] text-[#8B8B8B]"
                    type="email"
                    {...field}
                    placeholder="Email or Username"
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
                    className="bg-[#363536] border-[#494949] text-[#8B8B8B] "
                    type="password"
                    {...field}
                    placeholder="password"
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
              "LOGIN"
            )}
          </Button>
        </form>
        <div className="border w-full border-[#757575]" />
        <div className="text-[#8b8b8b] text-lg p-5">Forgot Password?</div>
        <div className="border w-28 border-[#757575]" />
        <p className="text-sm text-primary p-3">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="border-b border-primary hover:border-0 transition-all cursor-pointer"
          >
            Create Account
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default signinForm;
