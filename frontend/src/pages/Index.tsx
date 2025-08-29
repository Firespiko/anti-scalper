import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventCard } from "@/components/EventCard";
import { TransactionStatus, TransactionStatus as TxStatus } from "@/components/TransactionStatus";
import { NFTTicket } from "@/components/NFTTicket";
import { WalletConnect } from "@/components/WalletConnect";
import { Navbar } from "@/components/Navbar";
import { GiftModal } from "@/components/GiftModal";
import { SellModal } from "@/components/SellModal";
import { Zap, Shield, Ticket, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

// Add this helper function before the Index component
interface GroupedTicket {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatSection?: string;
  price: number;
  status: "valid" | "used" | "burnt" | "listed" | "gifted";
  txHash?: string;
  count: number;
  giftedTo?: string;
  giftDate?: string;
  sellPrice?: number;
}

// Update the groupTickets function to include transaction IDs
const groupTickets = (tickets: any[]): GroupedTicket[] => {
  const ticketMap: Record<string, any> = {};

  tickets.forEach(ticket => {
    const key = `${ticket.eventTitle}-${ticket.eventDate}-${ticket.eventLocation}-${ticket.price}`;
    
    if (ticketMap[key]) {
      ticketMap[key].count += 1;
      if (ticket.txHash) {
        ticketMap[key].transactionIds = [...(ticketMap[key].transactionIds || []), ticket.txHash];
      }
    } else {
      ticketMap[key] = {
        ...ticket,
        count: 1,
        transactionIds: ticket.txHash ? [ticket.txHash] : []
      };
    }
  });

  return Object.values(ticketMap);
};

const mockEvents = [
  {
    id: "1",
    title: "Neon Dreams Festival",
    date: "March 15, 2024 • 8:00 PM",
    location: "Digital Arena, Metaverse City",
    price: 50,
    availableTickets: 120,
    soldTickets: 365,
    burntTickets: 15,
    totalTickets: 500,
    category: "Music Festival",
  },
  {
    id: "2", 
    title: "Blockchain Summit 2024",
    date: "April 2, 2024 • 10:00 AM",
    location: "Convention Center, Tech District",
    price: 75,
    availableTickets: 0,
    soldTickets: 185,
    burntTickets: 15,
    totalTickets: 200,
    category: "Conference",
  },
  {
    id: "3",
    title: "Cyber Punk Concert",
    date: "May 20, 2024 • 9:00 PM", 
    location: "Holographic Hall, Neo Tokyo",
    price: 35,
    availableTickets: 89,
    soldTickets: 205,
    burntTickets: 6,
    totalTickets: 300,
    category: "Concert",
  },
];

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TxStatus | null>(null);
  const [purchasedTickets, setPurchasedTickets] = useState<any[]>([]);
  const [giftedTickets, setGiftedTickets] = useState<any[]>([]);
  const [events, setEvents] = useState(mockEvents);
  
  // Modal states
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isGifting, setIsGifting] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  // Create refs for sections
  const homeSectionRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLDivElement>(null);
  const ticketsSectionRef = useRef<HTMLDivElement>(null);

  // Load tickets from localStorage when wallet is connected
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      const savedTickets = localStorage.getItem(`nft_tickets_${walletAddress}`);
      if (savedTickets) {
        try {
          const parsedTickets = JSON.parse(savedTickets);
          setPurchasedTickets(parsedTickets);
        } catch (error) {
          console.error("Error parsing saved tickets:", error);
          setPurchasedTickets([]);
        }
      }
      
      // Load gifted tickets
      const savedGiftedTickets = localStorage.getItem(`gifted_tickets_${walletAddress}`);
      if (savedGiftedTickets) {
        try {
          const parsedGiftedTickets = JSON.parse(savedGiftedTickets);
          setGiftedTickets(parsedGiftedTickets);
        } catch (error) {
          console.error("Error parsing gifted tickets:", error);
          setGiftedTickets([]);
        }
      }
    }
  }, [isWalletConnected, walletAddress]);

  // Save tickets to localStorage whenever purchasedTickets changes
  useEffect(() => {
    if (isWalletConnected && walletAddress && purchasedTickets.length > 0) {
      try {
        localStorage.setItem(`nft_tickets_${walletAddress}`, JSON.stringify(purchasedTickets));
      } catch (error) {
        console.error("Error saving tickets to localStorage:", error);
      }
    }
  }, [purchasedTickets, isWalletConnected, walletAddress]);

  // Save gifted tickets to localStorage
  useEffect(() => {
    if (isWalletConnected && walletAddress && giftedTickets.length > 0) {
      try {
        localStorage.setItem(`gifted_tickets_${walletAddress}`, JSON.stringify(giftedTickets));
      } catch (error) {
        console.error("Error saving gifted tickets to localStorage:", error);
      }
    }
  }, [giftedTickets, isWalletConnected, walletAddress]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (menuBtn?.classList.contains('menu-open')) {
          menuBtn.classList.remove('menu-open');
          const mobileNav = document.querySelector('.mobile-nav');
          mobileNav?.classList.remove('mobile-nav-open');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWalletConnection = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected);
    setWalletAddress(address || null);
    
    // If disconnecting, also clear any pending transactions
    if (!connected) {
      setTransactionStatus(null);
      setPurchasedTickets([]);
      setGiftedTickets([]);
    }
  };

  const handleBuyTicket = (eventId: string) => {
    if (!isWalletConnected) return;
    
    const event = events.find(e => e.id === eventId);
    if (!event || event.availableTickets === 0) return;

    setTransactionStatus("pending");
    
    // Simulate transaction processing
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.8) {
        // 20% chance of fraud detection - ticket gets burnt
        setTransactionStatus("fraud");
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === eventId 
              ? { ...e, availableTickets: e.availableTickets - 1, burntTickets: e.burntTickets + 1 }
              : e
          )
        );
      } else {
        // 80% chance of success
        const ticketId = `TKT${Date.now()}`;
        const newTicket = {
          ticketId,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          price: event.price,
          status: "valid" as const,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        };
        setPurchasedTickets(prev => [...prev, newTicket]);
        setTransactionStatus("success");
        
        // Update event statistics
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === eventId 
              ? { ...e, availableTickets: e.availableTickets - 1, soldTickets: e.soldTickets + 1 }
              : e
          )
        );
      }
    }, 3000);
  };

  const openGiftModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsGiftModalOpen(true);
  };

  const openSellModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsSellModalOpen(true);
  };

  const handleGiftTicket = (receiverAddress: string) => {
    setIsGifting(true);
    
    // Simulate gifting process
    setTimeout(() => {
      // Remove ticket from purchased tickets
      setPurchasedTickets(prev => 
        prev.filter(t => t.ticketId !== selectedTicket.ticketId)
      );
      
      // Add ticket to gifted tickets with receiver info
      const giftedTicket = {
        ...selectedTicket,
        giftedTo: receiverAddress,
        giftDate: new Date().toLocaleDateString(),
        status: "gifted" as const
      };
      
      setGiftedTickets(prev => [...prev, giftedTicket]);
      
      // Close modal and reset state
      setIsGiftModalOpen(false);
      setIsGifting(false);
      setSelectedTicket(null);
      
      // Show success message
      setTransactionStatus("success");
      setTimeout(() => setTransactionStatus(null), 3000);
    }, 2000);
  };

  const handleSellTicket = (price: number) => {
    setIsSelling(true);
    
    // Simulate selling process
    setTimeout(() => {
      // Update ticket status to listed
      setPurchasedTickets(prev => 
        prev.map(t => 
          t.ticketId === selectedTicket.ticketId 
            ? { ...t, status: "listed" as const, sellPrice: price, price: price }
            : t
        )
      );
      
      // Close modal and reset state
      setIsSellModalOpen(false);
      setIsSelling(false);
      setSelectedTicket(null);
      
      // Show success message
      setTransactionStatus("success");
      setTimeout(() => setTransactionStatus(null), 3000);
    }, 2000);
  };

  // Function to scroll to sections
  const scrollToSection = (section: string) => {
    switch(section) {
      case "home":
        homeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "events":
        eventsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "tickets":
        ticketsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
      {selectedTicket && (
        <>
          <GiftModal
            ticket={selectedTicket}
            isOpen={isGiftModalOpen}
            onClose={() => {
              setIsGiftModalOpen(false);
              setSelectedTicket(null);
              setIsGifting(false);
            }}
            onGift={handleGiftTicket}
            isGifting={isGifting}
          />
          
          <SellModal
            ticket={selectedTicket}
            isOpen={isSellModalOpen}
            onClose={() => {
              setIsSellModalOpen(false);
              setSelectedTicket(null);
              setIsSelling(false);
            }}
            onSell={handleSellTicket}
            isSelling={isSelling}
          />
        </>
      )}

      {/* Navbar */}
      <Navbar 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnection={handleWalletConnection}
        scrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section 
        ref={homeSectionRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center pt-16"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            NFT TICKETS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure, verifiable, and fraud-proof event tickets powered by blockchain technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => scrollToSection("events")}
            >
              <Zap className="mr-2" />
              Explore Events
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Why Choose NFT Tickets?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gradient-card border-accent/20 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Fraud Protection</h3>
              <p className="text-muted-foreground">
                Advanced blockchain verification prevents counterfeiting and automatically burns fraudulent tickets
              </p>
            </Card>
            
            <Card className="p-8 bg-gradient-card border-accent/20 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">True Ownership</h3>
              <p className="text-muted-foreground">
                Own your tickets as NFTs - transfer, resell, or keep as collectibles with full ownership rights
              </p>
            </Card>
            
            <Card className="p-8 bg-gradient-card border-accent/20 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Transparent Pricing</h3>
              <p className="text-muted-foreground">
                No hidden fees, transparent blockchain transactions, and fair market-driven resale prices
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Transaction Status */}
      {transactionStatus && (
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <TransactionStatus
              status={transactionStatus}
              txId={transactionStatus === "success" ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined}
              ticketId={transactionStatus === "success" ? `TKT${Date.now()}` : undefined}
              eventName="Neon Dreams Festival"
              onClose={() => setTransactionStatus(null)}
            />
          </div>
        </section>
      )}

      {/* Events Section */}
      <section ref={eventsSectionRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                onBuyTicket={handleBuyTicket}
                walletConnected={isWalletConnected}
              />
            ))}
          </div>
        </div>
      </section>

      {/* My Tickets Section */}
      {(purchasedTickets.length > 0 || isWalletConnected) && (
        <section ref={ticketsSectionRef} className="py-20 px-6 bg-gradient-to-r from-accent/5 to-primary/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              {purchasedTickets.length > 0 ? "My NFT Tickets" : "My Tickets"}
            </h2>
            {purchasedTickets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupTickets(purchasedTickets).map((ticket, index) => (
                  <NFTTicket
                    key={index}
                    {...ticket}
                    onViewOnExplorer={() => console.log("View on explorer:", ticket.txHash)}
                    onSell={() => openSellModal(ticket)}
                    onGift={() => openGiftModal(ticket)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  You haven't purchased any tickets yet. Explore events and buy your first NFT ticket!
                </p>
                <Button 
                  variant="default" 
                  className="mt-6"
                  onClick={() => scrollToSection("events")}
                >
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gifted Tickets Section */}
      {giftedTickets.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Gifted Tickets
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupTickets(giftedTickets).map((ticket, index) => (
                <NFTTicket
                  key={`gifted-${index}`}
                  {...ticket}
                  status="gifted"
                  onViewOnExplorer={() => console.log("View on explorer:", ticket.txHash)}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                These tickets have been gifted to other wallet addresses
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;