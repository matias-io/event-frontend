import Link from 'next/link';
import WalletBar from './WalletBar';
import { useState, useEffect } from 'react';

const Header = () => {
  const [showWallet, setShowWallet] = useState(false);

  // Example of triggering wallet appearance (this could be after sign-in)
  useEffect(() => {
    // Simulate sign-in or action to show wallet
    const timer = setTimeout(() => setShowWallet(true), 500); // For demonstration, show wallet after 0.5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`bg-gray-900 text-white sticky top-0 z-50 shadow-md transition-all duration-500 ${
        showWallet ? 'py-6' : 'py-4'
      }`} // Animate padding for height change
    >
      <div className="mx-auto flex items-center justify-between px-6 max-w-7xl">
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold hover:scale-105 transition-transform duration-300">
          <Link href="/" className="hover:text-gray-300">
            Focusify
          </Link>
        </h1>

        {/* WalletBar, only shown after sign-in */}
        {showWallet && (
          <div className="flex">
            <WalletBar />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
