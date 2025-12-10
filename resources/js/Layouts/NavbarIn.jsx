// resources/js/Layouts/NavbarIn.jsx
import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import Logo from "./Logo";
import { MessageCircle, UserCircle, Bell, X } from "lucide-react";

export default function NavbarIn({ auth }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 900);
      // Tutup popup chat jika mode mobile
      if (window.innerWidth < 900) {
        setShowChatPopup(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fungsi navigasi pakai Inertia router
  const handleNavigate = (path) => {
    router.visit(path);
    setIsDropdownOpen(false);
  };

  // Fungsi logout pakai POST method
  const handleLogout = () => {
    router.post('/logout');
    setIsDropdownOpen(false);
  };

  // Fungsi untuk navigasi ke halaman Coming Soon
  const handleComingSoon = (feature) => {
    router.visit(`/coming-soon?feature=${feature}`);
  };

  // Fungsi handle chat button click
  const handleChatClick = () => {
    if (isMobile) {
      // Di mobile, navigasi ke halaman chat penuh
      router.visit(route('chat.index'));
    } else {
      // Di desktop, toggle popup
      setShowChatPopup(!showChatPopup);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#10121f] shadow-sm">
        {/* Logo Kiri */}
        <Logo />

        {/* Icon Kanan */}
        <div className="flex items-center gap-6 relative" ref={dropdownRef}>
          {/* ChatGroup */}
          <button
            onClick={handleChatClick}
            className={`text-purple-400 hover:text-white transition-colors cursor-pointer ${
              showChatPopup && !isMobile ? 'text-blue-600' : ''
            }`}
            title="Fitur Chat Group"
          >
            <MessageCircle size={22} />
          </button>

          {/* Notifikasi */}
          <button
            onClick={() => handleComingSoon('notification')}
            className="text-purple-400 hover:text-white transition-colors cursor-pointer"
            title="Fitur Notifikasi"
          >
            <Bell size={22} />
          </button>

          {/* Akun */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-purple-400 hover:text-white transition-colors cursor-pointer"
          >
            <UserCircle size={26} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-12 right-0 w-48 bg-[#10121f] rounded-lg shadow-lg">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-[#9843E9] cursor-pointer font-medium text-white"
                  onClick={() => handleNavigate('/profile')}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-[#9843E9] text-red-600 cursor-pointer font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Chat Popup untuk Desktop */}
      {showChatPopup && !isMobile && (
        <div className="fixed right-6 top-20 z-40 w-96 h-[calc(100vh-6rem)] bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col overflow-hidden">
          {/* Header Popup */}
          <div className="bg-[#222224] text-white p-4 flex items-center justify-between border-b border-[#3d5de8]">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle size={20} />
              Chat Group
            </h3>
            <button
              onClick={() => setShowChatPopup(false)}
              className="p-1 rounded-md hover:bg-[#3d5de8] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Popup Content - menggunakan iframe untuk load halaman chat */}
          <iframe
            src={route('chat.index')}
            className="flex-1 w-full h-full border-0"
            title="Chat Group"
          />
        </div>
      )}
    </>
  );
}
