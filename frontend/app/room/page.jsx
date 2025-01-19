"use client";

import { useState, useEffect } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import {encodeRoomDetails } from "./hashingUtils";


import { useAccount, useBalance, useReadContract, useNetwork } from "@starknet-react/core";

const HomePage = () => {

  const { address, status } = useAccount();
  // const { existingRoom, setExistingRoom } = useState(false);
  const [roomName, setRoomName] = useState("");
  const [timeLimit, setTimeLimit] = useState(25); // Default to 25 minutes for the room's timer
  const [price, setPrice] = useState(0); // Default to 25 minutes for the room's timer
  const [output, setOutput] = useState(""); // Default to 25 minutes for the room's timer
 const { data, error } = useBalance({});


const { chain } = useNetwork();
const { data: prevRoom, error: roomError } = useReadContract({
  abi: [
    {
      name: "get_balance",
      type: "function",
      inputs: [],
      outputs: [
        {
          type: "core::felt252", // Adjust if the output type is different
        },
      ],
      state_mutability: "view",
    },
  ],
  functionName: "get_balance",
  address: "0x030ae71e423bc35c408e5bd0134f4b35c78d7fa10a6f5c89c730be3d9c2f2cc4",
  args: [],
});



  useEffect(() => {
    if(status === "connected"){
        
    }


}, [address, status])
  
    const handleCreateRoom = () => {
      // Logic for creating a room (e.g., saving to a database or navigating to the room)
      setOutput("Room created with a " + timeLimit + "-minute timer! " +
        " HASH: " + (encodeRoomDetails({
          cost: price,
          epoch: (Math.floor(Date.now() / 1000) + timeLimit * 60),
          name: roomName,
        }))
      );
    };


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
<div className="flex flex-col items-center justify-center min-h-screen px-4">
  {/* If Not Signed In */}
  {!address && prevRoom==0 && (
    <div className="text-center p-6 rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Please Sign In</h1>
      <p className="text-lg text-gray-600 mb-6">You must sign in to create a room.</p>
    </div>
  )}

  {!address && prevRoom!=0 && (
    <div className="text-center p-6 rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Please Sign In</h1>
      <p className="text-lg text-gray-600 mb-6">You must sign in to create a room.</p>


    </div>
  )}


        {/* If Signed In */}
        {address && (
          <div className="w-full max-w-md p-8 bg-white rounded-lg  text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Existing Room</h1>
                <p className="text-gray-600 mt-2">You may have only 1 room active at one time. </p>
                  <br/>
                  <p className={prevRoom != 0 ? "text-lg text-red-600" : "text-lg text-green-600"}>
                {prevRoom != 0 ? 
                ("You have an existing room")
                :
       ("You have no existing rooms")}</p>



            <h1 className="pt-16 text-3xl font-semibold text-gray-800 mb-6">Create a New Room</h1>

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

<div className="mb-6">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                placeholder="Enter Room Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-600 mt-2">Minimum Entrance Price (in STRK)</p>
            </div>  

            <h1 className="pt-12 text-xl font-semibold text-gray-800">Current Balance</h1>
                <p className="text-gray-600 pb-4 ">Your Current Balance: <span className="text-green-600">{data?.value ? data?.value : "Unable to Fetch"}</span>
                </p>

            

            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-black transition duration-200"
            >
              Create Room
            </button>
            <h1 className="pt-12 text-xl font-semibold text-gray-800">Output</h1>
                <p className="text-gray-600 pb-4 ">{output}</p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HomePage;
