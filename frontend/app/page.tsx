"use client";

import CardContainer from "./Components/CardContainer";
import ManageRooms from "./Components/ManageRooms";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.2 },
  }),
};

const HomePage = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-none min-h-screen flex flex-col"
    >
      {/* Header Section */}
      <motion.div variants={containerVariants} custom={0}>
        <Header />
      </motion.div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 mt-16 ">
        <div className="w-full max-w-4xl text-center">
          {/* Manage Rooms Section */}
          <motion.div variants={containerVariants} custom={1}>
            <ManageRooms />
          </motion.div>

          {/* Wallet Bar and Market Section */}
          <motion.div className="mt-12" variants={containerVariants} custom={2}>
            <CardContainer />
          </motion.div>
        </div>
      </main>

      {/* Footer Section */}
      <motion.div variants={containerVariants} custom={1}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
