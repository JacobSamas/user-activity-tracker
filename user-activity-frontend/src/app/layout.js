"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initializeSocket, sendTrackingData } from "./utils/socket";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const socket = initializeSocket();

    // Track page views
    if (pathname) {
      sendTrackingData("page_view", { page: pathname });
    }

    // Track idle/active states
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      sendTrackingData("active", { page: pathname });
      idleTimer = setTimeout(() => sendTrackingData("idle", { page: pathname }), 30000); // 30 seconds idle
    };

    document.addEventListener("mousemove", resetIdleTimer);
    document.addEventListener("keypress", resetIdleTimer);

    // Initialize tracking
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener("mousemove", resetIdleTimer);
      document.removeEventListener("keypress", resetIdleTimer);
      if (socket) socket.disconnect();
    };
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-semibold text-blue-500">
              Activity Tracker
            </a>
            <div className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-blue-500">
                Home
              </a>
              <a href="/features" className="text-gray-600 hover:text-blue-500">
                Features
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
