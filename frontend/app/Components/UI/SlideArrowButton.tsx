import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useAccount } from '@starknet-react/core';

interface SlideArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  primaryColor?: string;
  onClick?: () => void;  // Added onClick prop to handle custom click events
}

export default function SlideArrowButton({
  text = "Create a room",
  className = "py-4",
  onClick,
  ...props
}: SlideArrowButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();

  const handleButtonClick = () => {
    if (address) {
      setIsModalOpen(true); // Open the modal if authenticated
    } else {
      const warning = document.getElementById("warning-text");
      if (warning) {
        warning.classList.remove("hidden");
        setTimeout(() => {
          warning.classList.add("hidden");
        }, 3000); // Hide warning after 3 seconds
      }
    }

    if (onClick) onClick(); // Call the onClick prop if provided
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Set background color conditionally based on address state
  const backgroundColor = address ? "bg-green-900" : "bg-red-900";

  return (
    <div className="relative">
      {/* Button */}
      <button
        className={`group relative rounded-full border border-white bg-white p-2 text-xl font-semibold ${className}`}
        onClick={handleButtonClick} // Trigger the button click handler
        {...props}
      >
        <div
          className={`absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover:w-full ${backgroundColor}`}
        >
          <span className="mr-3 text-white transition-all duration-200 ease-in-out">
            <ArrowRight size={20} />
          </span>
        </div>
        <span className="relative left-4 z-10 whitespace-nowrap px-8 font-semibold text-black transition-all duration-200 ease-in-out group-hover:-left-3 group-hover:text-white">
          {text}
        </span>
      </button>

      {/* Warning Text */}
      <div
        id="warning-text"
        className="hidden mt-2 text-center text-sm text-red-600"
      >
        Please sign in to create a room.
      </div>

      {/* Modal */}
      {isModalOpen && false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-1/3 rounded-lg bg-white p-6 shadow-lg">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <X size={24} />
            </button>
            {/* Modal Content */}
            <h2 className="text-lg font-semibold">Room Creation</h2>
            <p className="mt-4 text-gray-700">
              This is where you can create a room. Add your parameters here.
            </p>
            <button
              className="mt-6 rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
