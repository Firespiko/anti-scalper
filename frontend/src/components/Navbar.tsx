import { useState, useEffect } from "react";
import { WalletConnect } from "@/components/WalletConnect";
import "./Navbar.css";

interface NavbarProps {
  isWalletConnected: boolean;
  walletAddress: string | null;
  onWalletConnection: (connected: boolean, address?: string) => void;
  scrollToSection: (section: string) => void;
}

export const Navbar = ({
  isWalletConnected,
  walletAddress,
  onWalletConnection,
  scrollToSection
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleWalletMenu = () => {
    setIsWalletMenuOpen(!isWalletMenuOpen);
  };

  const handleDisconnect = () => {
    // Use the static disconnect method
    WalletConnect.disconnect();
    onWalletConnection(false, undefined);
    setIsWalletMenuOpen(false);
  };

  // Close wallet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isWalletMenuOpen && !(event.target as Element).closest('.wallet-container')) {
        setIsWalletMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isWalletMenuOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <div className="logo-text">
            NFT <span className="accent">TICKETS</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className={`nav-links-container ${isScrolled ? 'nav-links-floating' : ''}`}>
          <ul className="nav-links desktop-nav">
            <li><a onClick={() => { scrollToSection("home"); closeMenu(); }}>Home</a></li>
            <li><a onClick={() => { scrollToSection("events"); closeMenu(); }}>Events</a></li>
            <li><a onClick={() => { scrollToSection("tickets"); closeMenu(); }}>My Tickets</a></li>
          </ul>
        </div>
        
        {/* Auth Section - Wallet Status */}
        <div className="auth-section">
          {isWalletConnected ? (
            <div className="wallet-container relative">
              <div 
                className="flex items-center gap-2 bg-transparent border border-violet-500/30 rounded-full px-3 py-1 cursor-pointer hover:bg-violet-500/10 transition-all duration-200 backdrop-blur-sm"
                onClick={toggleWalletMenu}
              >
                <div className="w-8 h-8 bg-violet-600/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
                    <path d="M20 9V5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v4"></path>
                    <path d="M20 9v10c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V9"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>
              </div>
              
              {/* Wallet Dropdown Menu */}
              {isWalletMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background/90 backdrop-blur-lg rounded-lg border border-border shadow-lg z-50">
                  <div className="p-2">
                    <div
                      onClick={handleDisconnect}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-violet-600/10 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" x2="9" y1="12" y2="12"></line>
                      </svg>
                      Disconnect Wallet
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <WalletConnect onConnectionChange={onWalletConnection} />
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'menu-open' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
          <ul className="mobile-nav-links">
            <li><a onClick={() => { scrollToSection("home"); closeMenu(); }}>Home</a></li>
            <li><a onClick={() => { scrollToSection("events"); closeMenu(); }}>Events</a></li>
            <li><a onClick={() => { scrollToSection("tickets"); closeMenu(); }}>My Tickets</a></li>
            
            {isWalletConnected ? (
              <li className="mt-8">
                <div
                  onClick={handleDisconnect}
                  className="w-full mx-4 px-4 py-3 bg-transparent border border-violet-500/30 text-white hover:bg-violet-500/10 rounded-full hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                  </svg>
                  Disconnect Wallet
                </div>
              </li>
            ) : (
              <li className="mt-8">
                <div className="px-4">
                  <WalletConnect onConnectionChange={onWalletConnection} />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};