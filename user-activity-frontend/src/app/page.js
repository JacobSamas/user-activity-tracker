"use client";

import { sendTrackingData } from "./utils/socket";

export default function HomePage() {
  const handleButtonClick = (buttonName) => {
    sendTrackingData("button_click", { button: buttonName });
  };

  return (
    <main className="flex flex-col items-center justify-center text-center space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the User Activity Tracker
        </h1>
        <p className="text-gray-600">
          This application tracks your interactions in real-time, including page views, clicks, idle states, and active states.
        </p>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => handleButtonClick("Start Tracking")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Start Tracking
        </button>
        <button
          onClick={() => handleButtonClick("View Features")}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400"
        >
          View Features
        </button>
      </div>
    </main>
  );
}
