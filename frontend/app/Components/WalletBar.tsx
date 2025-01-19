import { useConnect, useDisconnect, useAccount } from '@starknet-react/core';
import { useState, useEffect } from 'react';

const WalletBar: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [showAddress, setShowAddress] = useState(false);

  // Simulate the address fading in
  useEffect(() => {
    if (address) {
      const timer = setTimeout(() => setShowAddress(true), 500); // Delay for smooth fade-in
      return () => clearTimeout(timer);
    }
  }, [address]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* If address is not available (user is not connected) */}
      {!address ? (
        <div className="flex flex-wrap justify-center gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="border border-gray-800 text-white font-medium py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Connect {connector.id}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          {/* Fade-in and color change for the address */}
          <div
            className={`text-sm px-4 py-2 rounded-lg bg-gray-600 text-white transition-all duration-700 ${
              showAddress
                ? 'opacity-100 text-blue-200 transform translate-y-0'
                : 'opacity-0 text-yellow-400 transform translate-y-4'
            }`}
          >
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <button
            onClick={() => disconnect()}
            className="border border-gray-800 text-white font-medium py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletBar;
