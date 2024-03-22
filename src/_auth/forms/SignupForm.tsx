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
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Modal from "@/components/shared/Modal";
import { useToast } from "@/components/ui/use-toast";

const SignupForm = () => {
  const { toast } = useToast();

  const isloading = false;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");

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
      const response = await axios.post(
        "http://localhost:3001/auth/register",
        values
      );
      console.log("data posted", response.data);
      if (response.data) {
        setUserId(response.data._id);
        setShowModal(true);
        toast({
          duration: 2000,
          description: response.data.message,
        });
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

  const closeModal = () => {
    setShowModal(false);
    navigate("/sign-in");
  };
  return (
    <>
      <Form {...form}>
        <div className="sm:w-420 flex justify-center items-center flex-col">
          <h1 className="text-4xl font-bold">Moments</h1>
          <h2 className="lg:text-xl font-semibold md:tex-lg pt-5 sm:pt-12">
            Create a new account
          </h2>
          <p className="mt-2">To post your moments enter your details</p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FirstName</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LastName</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UserName</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                "Sign up"
              )}
            </Button>
            <p className="text-sm mt-2">
              Already have an account?
              <Link to="/sign-in" className="border">
                Login
              </Link>
            </p>
          </form>
        </div>
      </Form>
      {showModal && (
        <Modal userId={userId} onClose={closeModal}>
          <Button onClick={closeModal}>Close</Button>
        </Modal>
      )}
    </>
  );
};

export default SignupForm;
