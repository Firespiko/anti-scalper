import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

interface WalletConnectProps {
  onConnectionChange: (connected: boolean, address?: string) => void;
}

// Setup Stacks auth config
const appConfig = new AppConfig(["publish_data"]);
const userSession = new UserSession({ appConfig });

export const WalletConnect = ({ onConnectionChange }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = () => {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        const address = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
        onConnectionChange(true, address || undefined);
      }
    };

    // Handle the case where we're returning from the authentication flow
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => {
        const userData = userSession.loadUserData();
        const address = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet;
        onConnectionChange(true, address || undefined);
        setIsConnecting(false);
      });
    } else {
      checkConnection();
    }
  }, [onConnectionChange]);

  const connectWallet = () => {
    setIsConnecting(true);
    showConnect({
      appDetails: {
        name: "NFT Tickets",
        icon: window.location.origin + "/logo.png", // Replace with your app's logo URL
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      onCancel: () => {
        setIsConnecting(false);
      },
      userSession,
    });
  };

  // Expose disconnect function for external use
  WalletConnect.disconnect = () => {
    const appConfig = new AppConfig(["publish_data"]);
    const userSession = new UserSession({ appConfig });
    
    if (userSession.isUserSignedIn()) {
      userSession.signUserOut();
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-transparent border-violet-500/30 hover:bg-violet-500/10 text-white hover:text-white transition-all duration-200 backdrop-blur-sm rounded-full px-4 py-2"
    >
      <Wallet className="w-5 h-5 text-violet-400" />
      <span className="text-white">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
    </Button>
  );
};

// Static method to disconnect wallet from outside
WalletConnect.disconnect = () => {
  const appConfig = new AppConfig(["publish_data"]);
  const userSession = new UserSession({ appConfig });
  
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
};