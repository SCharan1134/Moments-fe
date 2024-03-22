import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setLogin } from "@/state";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

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
      const loggedInResponse = await axios.post(
        "http://localhost:3001/auth/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
      <div className="sm:w-420 flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold">Moments</h1>
        <h2 className="lg:text-xl font-semibold md:tex-lg pt-5 sm:pt-12">
          Login to your account
        </h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
              "Log in"
            )}
          </Button>
          <p className="text-sm mt-2">
            doesn't have an account?
            <Link to="/sign-up" className="border">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default signinForm;
