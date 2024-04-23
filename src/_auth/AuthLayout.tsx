import { Outlet, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <div className="w-full h-screen overflow-clip flex items-center justify-center bg-secondary">
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="p-5">
          <div className="bg-moment flex flex-col lg:flex-row border border-[#474748] rounded-xl overflow-hidden max-w-[1115px] w-full sm:h-[800px] md:h-[600px] lg:h-[555px] xl:h-[555px]   items-center justify-between">
            <div className="w-full lg:w-[462px] h-[150px] lg:h-full flex-shrink-0">
              <img
                src="./auth-pic.jpg"
                className="object-cover w-full h-full"
                alt="Authentic Image"
              />
            </div>
            <div className="w-full h-auto lg:w-auto flex-1 lg:p-6 sm:p-2">
              <Outlet />
            </div>
          </div>
        </section>
      )}
      <Toaster />
    </div>
  );
};

export default AuthLayout;
