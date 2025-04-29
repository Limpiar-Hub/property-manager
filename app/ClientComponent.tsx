"use client"; 

import { useEffect } from "react";

const ClientComponent = () => {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "system";
    const root = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, []);

  return null; 
};

export default ClientComponent;
