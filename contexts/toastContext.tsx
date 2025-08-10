"use client";

import { ToastType } from "@/constants/toast";
import { createContext, useContext, useState } from "react";

interface ToastContextType {
  isToastOpen: boolean;
  toastType: ToastType | null;
  openToast: (type: ToastType) => void;
  closeToast: () => void;
}

export const ToastContext = createContext<ToastContextType>({
  isToastOpen: false,
  toastType: null,
  openToast: () => {},
  closeToast: () => {},
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastType, setToastType] = useState<ToastType | null>(null);

  const openToast = (type: ToastType) => {
    setToastType(type);
    setIsToastOpen(true);
  };

  const closeToast = () => {
    setIsToastOpen(false);
    setToastType(null);
  };

  return (
    <ToastContext.Provider
      value={{
        isToastOpen,
        toastType,
        openToast,
        closeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
