import { Outlet, Navigate } from "react-router-dom";

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
    </>
  );
};

export default AuthLayout;
