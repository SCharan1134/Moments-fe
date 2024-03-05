import { Routes, Route, Navigate } from "react-router-dom";
import SigninForm from "./_auth/forms/SigninForm";
import { Home, ProfilePage } from "./_root/pages";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { useSelector } from "react-redux";
import FriendSuggestionList from "./components/shared/FriendSuggestionList";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <main className="flex h-screen">
      <Routes>
        {/* public */}
        <Route element={!isAuth ? <AuthLayout /> : <Navigate to="/home" />}>
          <Route index path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        {/* private */}
        <Route element={isAuth ? <RootLayout /> : <Navigate to="/sign-in" />}>
          <Route path="*" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/temp" element={<FriendSuggestionList />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
