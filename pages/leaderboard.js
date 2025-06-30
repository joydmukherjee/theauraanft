import React from 'react';
import Leaderboard from "../src/app/components/Leaderboard"; // Adjust path as needed
//import NavbarWithWalletProvider from '../components/Navbar'; // Adjust path as needed

const LeaderboardPage = () => {
  return (
    <div>
      {/* <NavbarWithWalletProvider isMuted={false} onToggleSound={() => {}} /> */}
      <Leaderboard />
    </div>
  );
};

export default LeaderboardPage;