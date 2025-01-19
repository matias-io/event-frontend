// import React, { useState } from 'react';
import { useAccount } from '@starknet-react/core';
// import { invoke } from '@starknet-react/sdk'; // Assuming invoke is from Starknet SDK
import SlideArrowButton from './UI/SlideArrowButton'; // Your custom button
import { redirect } from 'next/navigation'

const CreateRoom = () => {
  const { account } = useAccount();
  // const [stake, setStake] = useState('');
  // const [duration, setDuration] = useState('');

  const handleCreateRoom = async () => {
    if (!account) {
      // alert('Connect your wallet first!');
      return;
    } else{
      redirect('/room');
    }
  
  };

  // const handleJoinRoom = async () => {
  //   if (!account) {
  //     alert('Connect your wallet first!');
  //     return;
  //   }
  //   redirect('/room')
  // };

  return (
    <div>
      {/* <h1>Create a Study Room</h1> */}
      
      {/* Pass handleSubmit to the SlideArrowButton */}
      <SlideArrowButton 
        onClick={handleCreateRoom} // Pass the handleSubmit function to the button
        text="Create a Room" // Custom text for the button
        // primaryColor="#336" // Button color (customizable)
      />
      {/* <SlideArrowButton 
        onClick={handleJoinRoom} // Pass the handleSubmit function to the button
        text="Join the room" // Custom text for the button
        primaryColor="#336" // Button color (customizable)
      /> */}

      {/* Input Fields
      <input
        type="number"
        placeholder="Stake (ETH)"
        value={stake}
        onChange={(e) => setStake(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      /> */}
    </div>
  );
};

export default CreateRoom;
