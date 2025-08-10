"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "../../contexts/toastContext";
import toastTypes from "../../constants/toast";
import { combineClass } from "@/helpers/combineClass";

const Toast = () => {
  const { isToastOpen, toastType, closeToast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isToastOpen) {
      setIsAnimating(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);

        animationTimeoutRef.current = setTimeout(() => {
          closeToast();
        }, 500);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isToastOpen, closeToast]);

  if (!toastType) return null;
  const toast = toastTypes[toastType];

  return (
    <div
      className={combineClass(
        "fixed bottom-10 left-8 w-80 max-h-30 rounded-md px-3 py-5 transition-all duration-300 ease-out",
        isToastOpen && isAnimating
          ? "translate-x-0 opacity-100"
          : "-translate-x-full left-0 opacity-0",
        toast.type === "error"
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"
      )}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
