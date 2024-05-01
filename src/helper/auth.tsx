import { redirect } from "react-router-dom";

export function getAuthToken() {
  const storedItem = JSON.parse(localStorage.getItem("isLoggedIn"));
  if (!storedItem || new Date().getTime() > storedItem.expiry) {
    localStorage.removeItem("isLoggedIn");
    return null;
  }
  return storedItem;
}

export function isAdminLoggedIn() {
  const loggedIn = getAuthToken();
  if (loggedIn.role === "admin") return true;
  return false;
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoaderSpecial() {
  if (!isAdminLoggedIn()) {
    return redirect("/home");
  }
  return null;
}

export function checkAuthLoader() {
  const isLoggedIn = getAuthToken();
  console.log("test");

  if (!isLoggedIn) {
    console.log("test in");
    return redirect("/");
  }
  return null;
}
