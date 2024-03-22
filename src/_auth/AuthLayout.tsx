import { Outlet, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="flex  justify-center items-center flex-col py-10 h-screen w-full">
          <Outlet />
        </section>
      )}
      <Toaster />
    </>
  );
};

export default AuthLayout;
