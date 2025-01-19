"use client";

import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

import { useAccount } from "@starknet-react/core";

const HomePage = () => {
  const { address } = useAccount();
  const [roomName, setRoomName] = useState("");
  const [timeLimit, setTimeLimit] = useState(25); // Default to 25 minutes for the room's timer

  const handleCreateRoom = () => {
    // Logic for creating a room (e.g., saving to a database or navigating to the room)
    alert(`Room "${roomName}" created with a ${timeLimit}-minute timer!`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* If Not Signed In */}
        {!address && (
          <div className="text-center p-6 rounded-lg ">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Please Sign In</h1>
            <p className="text-lg text-gray-600 mb-6">You must sign in to create a room.</p>
          </div>
        )}

        {/* If Signed In */}
        {address && (
          <div className="w-full max-w-md p-8 bg-white rounded-lg  text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Create a New Room</h1>

            {/* Room Name Input */}
            <div className="mb-4">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Timer Duration Input */}
            <div className="mb-6">
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min="1"
                max="120"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-600 mt-2">Set Timer (in minutes)</p>
            </div>

            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-black transition duration-200"
            >
              Create Room
            </button>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HomePage;
