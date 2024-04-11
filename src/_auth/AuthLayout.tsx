import { Outlet, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="bg-secondary w-screen h-screen flex items-center justify-center ">
          <div className="bg-moment flex border border-[#474748] rounded-xl overflow-hidden w-[1115px] h-[555px] items-center justify-between">
            <Outlet />
            <div className="w-[462px] h-full flex-shrink-0">
              <img
                src="./auth-pic.jpg"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
      )}
      <Toaster />
    </>
  );
};

export default AuthLayout;
