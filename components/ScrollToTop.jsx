"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from "react";


const ScrollToTop = () => {
  const { pathname } = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth" if you want smooth scrolling
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
