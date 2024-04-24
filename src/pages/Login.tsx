import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WildCats from "../../public/wildcats.png";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [errorHighlight, setErrorHighlight] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [usersData, setUsersData] = useState(undefined);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function handleLogin() {
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (email === "" || password === "") {
      console.log("in");
      setErrorHighlight("bg-red-100 border-2 border-red-200");
      return;
    }
    emailRef.current.disabled = true;
    passwordRef.current.disabled = true;
    setIsSubmit(true);
    let response = usersData;
    if (usersData === undefined) {
      response = (await axios.get(`https://localhost:7124/api/user`)).data.map(
        (user) => ({
          ...user,
          Name: `${user.firstName} ${user.lastName}`, // Calculate fullname
        })
      );
      setUsersData(response);
    }
    console.log(response);
    const foundUser = response.filter((user) => {
      console.log(user);
      if (user.username === email && user.password === password) {
        return true;
      }
    });
    console.log(foundUser);
    if (foundUser.length > 0) {
      const oneHourFromNow = new Date().getTime() + 3600000;

      localStorage.setItem(
        "isLoggedIn",
        JSON.stringify({
          id: foundUser[0].id,
          role: foundUser[0].role,
          expiry: oneHourFromNow,
        })
      );
      setIsSubmit(false);
      return navigate("/home");
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
                className={errorHighlight}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <NavLink
                  to={"/forgot-password"}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </NavLink>
              </div>
              <Input
                id="password"
                type="password"
                required
                ref={passwordRef}
                className={errorHighlight}
              />
            </div>
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
