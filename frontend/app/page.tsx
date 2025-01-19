"use client";

import CardContainer from "./Components/CardContainer";
import ManageRooms from "./Components/ManageRooms";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 mt-16">
        <div className="w-full max-w-4xl text-center">
          {/* Manage Rooms Section */}
          <ManageRooms />

          {/* Wallet Bar and Market Section */}
          <div className="mt-12">
            {/* <WalletBar /> */}
            <CardContainer />
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HomePage;
