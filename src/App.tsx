"use client";
// import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { createRouter } from "./router";
import "./styles/globals.css";
export const mainAppRouter = createRouter();
export function App() {
  return (
    <>
      <RouterProvider router={mainAppRouter} />
    </>
  );
}
