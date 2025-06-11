// hooks/useScrollSnap.ts
import { useEffect } from "react";

export const useScrollSnap = () => {
  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (!isScrolling) {
        isScrolling = true;
        const direction = e.deltaY > 0 ? 1 : -1;
        const currentPage = Math.round(window.scrollY / window.innerHeight);
        const totalPages = document.querySelectorAll(".h-screen").length;
        const targetPage = Math.max(
          0,
          Math.min(totalPages - 1, currentPage + direction)
        );

        window.scrollTo({
          top: targetPage * window.innerHeight,
          behavior: "smooth",
        });

        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
};
