import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WildCats from "../../public/wildcats.png";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [error, setError] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [usersData, setUsersData] = useState(undefined);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleLogin() {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (email === "" || password === "") {
      setError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmit(true);

    try {
      let response = usersData;
      if (!usersData) {
        const { data } = await axios.get(
          "https://3s-backend-production.up.railway.app/api/user"
        );
        response = data.map((user) => ({
          ...user,
          Name: `${user.firstName} ${user.lastName}`,
        }));
        setUsersData(response);
      }

      const foundUser = response.find(
        (user) => user.username === email && user.password === password
      );
      if (foundUser) {
        const oneHourFromNow = new Date().getTime() + 3600000;
        localStorage.setItem(
          "isLoggedIn",
          JSON.stringify({
            id: foundUser.id,
            role: foundUser.role,
            expiry: oneHourFromNow,
          })
        );
        navigate("/home");
      } else {
        setError("Invalid email or password.");
        setIsSubmit(false);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsSubmit(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your institution email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@cit.edu"
                ref={emailRef}
                className={error ? "bg-red-100 border-2 border-red-200" : ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <NavLink
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </NavLink>
              </div>
              <Input
                id="password"
                type="password"
                ref={passwordRef}
                className={error ? "bg-red-100 border-2 border-red-200" : ""}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-400"
              onClick={handleLogin}
              disabled={isSubmit}
            >
              Login
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Login with Microsoft
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <NavLink to="#" className="underline">
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={WildCats}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
