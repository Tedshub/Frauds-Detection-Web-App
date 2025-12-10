// resources/js/Layouts/Logo.jsx
import React from "react";
import { usePage } from "@inertiajs/react";
import { CreditCard } from "lucide-react";

export default function Logo() {
  const { auth } = usePage().props;

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) return "Selamat pagi";
    if (hour >= 12 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 19) return "Selamat sore";
    return "Selamat malam";
  };

  const getUserName = () => auth.user?.name || "User";

  return (
    <div className="flex items-center space-x-3">
      {/* Logo seperti pada navbar Welcome.jsx */}
      <div className="flex items-center gap-2">
        <CreditCard className="w-8 h-8 text-purple-400" />
      </div>

      {/* Greeting */}
      <span className="font-bold text-xl text-white tracking-wide">
        {getGreeting()}, {getUserName()}!
      </span>
    </div>
  );
}
