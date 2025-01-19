"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";

import { useAccount } from "@starknet-react/core";

const SlugPage = ({ params }) => {
  const { address } = useAccount();
  const [isInRoom, setIsInRoom] = useState(false); // Replace with actual room membership state
  const [timeRemaining, setTimeRemaining] = useState(1500); // Hardcoded timer (e.g., 25 minutes)

  const handleJoinRoom = () => {
    setIsInRoom(true);
    setTimeRemaining(1500); // Example: 25-minute Pomodoro timer
  };

  // Convert timeRemaining to MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Countdown effect (only runs when timer starts)
  useEffect(() => {
    if (isInRoom && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, isInRoom]);

  return (
    <>
      {/* Header Section */}
      <div>
        <Header />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 ${
          address && isInRoom && timeRemaining > 0
            ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-80 animate-pulse"
            : "bg-gray-50"
        }`}
      >
        {/* If Not Signed In */}
        {!address && (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Please Sign In</h1>
            <p className="text-lg text-gray-600 mb-6">You must sign in to create a room.</p>
          </div>
        )}

        {/* If Signed In but Not in Room */}
        {address && !isInRoom && (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Join Room: {params.slug}</h1>
            <p className="text-lg mb-6">
              Join this room for only <span className="font-semibold">$5.00</span>.
            </p>
            <button
              onClick={handleJoinRoom}
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-black transition"
            >
              Confirm Join
            </button>
          </div>
        )}

        {/* If Signed In and Already in Room */}
        {address && isInRoom && (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6">Room: {params.slug}</h1>
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold mb-4">Focus Timer</h2>
              <div className="text-4xl font-mono">{formatTime(timeRemaining)}</div>
              <p className="mt-4 text-gray-600">
                Stay focused and finish your session before leaving!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div>
        <Footer />
      </div>
    </>
  );
};

export default SlugPage;
