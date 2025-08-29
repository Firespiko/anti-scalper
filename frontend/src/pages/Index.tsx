import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/EventCard";
import { TransactionStatus } from "@/components/TransactionStatus";
import { NFTTicket } from "@/components/NFTTicket";
import { WalletConnect } from "@/components/WalletConnect";
import { Navbar } from "@/components/Navbar";
import { GiftModal } from "@/components/GiftModal";
import { SellModal } from "@/components/SellModal";

import { Zap, Shield, Ticket, TrendingUp, Store, Wallet, Calendar, MapPin } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

// Import event images
import neonImg from "@/assets/neon.jpg";
import summitImg from "@/assets/summit.jpg";
import cyberpunkImg from "@/assets/cyberpunk.jpg";

interface GroupedTicket {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatSection?: string;
  price: number;
  status: "valid" | "used" | "burnt" | "listed" | "gifted" | "for-sale";
  txHash?: string;
  count: number;
  giftedTo?: string;
  giftDate?: string;
  sellPrice?: number;
  transactionIds?: string[];
}

const groupTickets = (tickets: any[]): GroupedTicket[] => {

  const ticketMap: Record<string, any> = {};

  tickets.forEach(ticket => {
    const priceKey = ticket.status === "listed" || ticket.status === "for-sale" 
      ? ticket.sellPrice || ticket.price 
      : ticket.price;
      
    const key = `${ticket.eventTitle}-${ticket.eventDate}-${ticket.eventLocation}-${priceKey}-${ticket.status}`;
    
    if (ticketMap[key]) {
      ticketMap[key].count += 1;
      if (ticket.txHash) {
        ticketMap[key].transactionIds = [...(ticketMap[key].transactionIds || []), ticket.txHash];
      }
    } else {
      ticketMap[key] = {
        ...ticket,
        count: 1,
        transactionIds: ticket.txHash ? [ticket.txHash] : [],
        price: priceKey
      };
    }
  });

  return Object.values(ticketMap);
};

// Mock events data
const mockEvents: EventType[] = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const features = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Fraud Protection",
    description: "Advanced blockchain verification prevents counterfeiting and automatically burns fraudulent tickets",
  },
  {
    id: 2,
    icon: <Ticket className="w-8 h-8 text-accent" />,
    title: "True Ownership",
    description: "Own your tickets as NFTs - transfer, resell, or keep as collectibles with full ownership rights",
  },
  {
    id: 3,
    icon: <TrendingUp className="w-8 h-8 text-cyan-400" />,
    title: "Transparent Pricing",
    description: "No hidden fees, transparent blockchain transactions, and fair market-driven resale prices",
  },
];

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TxStatus>(null);
  const [purchasedTickets, setPurchasedTickets] = useState<Ticket[]>([]);
  const [giftedTickets, setGiftedTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<EventType[]>(mockEvents);
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  
  // Modal states
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isGifting, setIsGifting] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  // Ticket selection state
  const [selectedTickets, setSelectedTickets] = useState<Record<string, boolean>>({});
  
  // Create refs for sections
  const homeSectionRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLDivElement>(null);
  const ticketsSectionRef = useRef<HTMLDivElement>(null);

  // Get user session
  const appConfig = new AppConfig(["publish_data"]);
  const userSession = new UserSession({ appConfig });

  // Load contract data when wallet is connected
  useEffect(() => {
    const loadContractData = async () => {
      if (isWalletConnected && walletAddress) {
        setLoading(true);
        try {
          // Load contract data
          const totalSupply = await clarityApi.getTotalSupply();
          const lastTokenId = await clarityApi.getLastTokenId();
          
          setContractData({
            totalSupply,
            lastTokenId
          });
          
          // Load user tickets from backend (verified with Clarity)
          const ticketsResponse = await ticketApi.getUserTickets("user-id", walletAddress); // Replace with real user ID
          if (ticketsResponse.success && ticketsResponse.data) {
            setPurchasedTickets(ticketsResponse.data);
          }
          
          // Load gifted tickets
          const giftedResponse = await ticketApi.getGiftedTickets("user-id"); // Replace with real user ID
          if (giftedResponse.success && giftedResponse.data) {
            setGiftedTickets(giftedResponse.data);
          }
        } catch (error) {
          console.error('Error loading contract data:', error);
          setTransactionStatus("error");
          setTimeout(() => setTransactionStatus(null), 3000);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset data when disconnected
        setContractData(null);
        setPurchasedTickets([]);
        setGiftedTickets([]);
      }
    };

    loadContractData();
  }, [isWalletConnected, walletAddress]);

  const handleWalletConnection = (connected: boolean, address?: string) => {
    setIsWalletConnected(connected);
    setWalletAddress(address || null);
    
    // If disconnecting, also clear any pending transactions
    if (!connected) {
      setTransactionStatus(null);
      setCurrentUser(null);
      setPurchasedTickets([]);
      setGiftedTickets([]);
      setContractData(null);
    }
  };

  const handleBuyTicket = async (eventId: string) => {
    if (!isWalletConnected || !walletAddress) {
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus(null), 3000);
      return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event || event.availableTickets === 0) {
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus(null), 3000);
      return;
    }

    setTransactionStatus("pending");
    
    try {
      // Call the buy ticket function
      const response = await ticketApi.buyTicket("user-id", eventId, walletAddress); // Replace with real user ID
      
      if (response.success && response.data) {
        // Add new ticket to purchased tickets
        setPurchasedTickets(prev => [...prev, response.data!]);
        setTransactionStatus("success");
        
        // Update event statistics
        setEvents(prev => 
          prev.map(e => 
            e.id === eventId 
              ? { 
                  ...e, 
                  availableTickets: e.availableTickets - 1, 
                  soldTickets: e.soldTickets + 1 
                }
              : e
          )
        );
        
        setTimeout(() => setTransactionStatus(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to purchase ticket');
      }
    } catch (error) {
      console.error('Error buying ticket:', error);
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
  };

  const openGiftModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsGiftModalOpen(true);
  };

  const openSellModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsSellModalOpen(true);
  };

  const handleGiftTicket = async (receiverAddress: string) => {
    if (!selectedTicket || !walletAddress) {
      setIsGifting(false);
      setIsGiftModalOpen(false);
      setSelectedTicket(null);
      return;
    }
    
    setIsGifting(true);
    
    try {
      const response = await ticketApi.giftTicket(
        selectedTicket.id, 
        "user-id", // Replace with real user ID
        receiverAddress,
        walletAddress,
        selectedTicket.tokenId || 0
      );
      
      if (response.success && response.data) {
        // Remove ticket from purchased tickets
        setPurchasedTickets(prev => 
          prev.filter(t => t.id !== selectedTicket.id)
        );
        
        // Add ticket to gifted tickets
        setGiftedTickets(prev => [...prev, response.data!]);
        
        // Close modal and reset state
        setIsGiftModalOpen(false);
        setIsGifting(false);
        setSelectedTicket(null);
        
        // Show success message
        setTransactionStatus("success");
        setTimeout(() => setTransactionStatus(null), 3000);
      } else {
        throw new Error(response.error || 'Failed to gift ticket');
      }
    } catch (error) {
      console.error('Error gifting ticket:', error);
      setIsGifting(false);
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus(null), 3000);
    }
  };

  const handleSellTicket = (price: number, quantity: number = 1) => {
    setIsSelling(true);
    
    // Check if price is too high (implementing burn logic)
    const isOverpriced = price > selectedTicket.price * 3; // 3x original price limit
    
    // Simulate selling process
    setTimeout(() => {
      if (isOverpriced) {
        // Burn the ticket
        setPurchasedTickets(prev => 
          prev.map(t => 
            t.ticketId === selectedTicket.ticketId 
              ? { ...t, status: "burnt" as const } 
              : t
          )
        );
        setTransactionStatus("fraud");
      } else {
        // Update tickets - move specified quantity to "for-sale" status
        setPurchasedTickets(prev => {
          const updatedTickets = [...prev];
          const ticketIndex = updatedTickets.findIndex(t => 
            t.eventTitle === selectedTicket.eventTitle &&
            t.eventDate === selectedTicket.eventDate &&
            t.eventLocation === selectedTicket.eventLocation &&
            t.price === selectedTicket.price &&
            t.status === "valid"
          );
          
          if (ticketIndex !== -1) {
            const ticketToSplit = updatedTickets[ticketIndex];
            
            // If selling all tickets of this type
            if (quantity >= ticketToSplit.count) {
              updatedTickets[ticketIndex] = {
                ...ticketToSplit,
                status: "for-sale" as const,
                sellPrice: price,
                price: price
              };
            } else {
              // Split tickets - keep some as valid, mark some as for-sale
              // Update existing ticket with reduced count
              updatedTickets[ticketIndex] = {
                ...ticketToSplit,
                count: ticketToSplit.count - quantity
              };
              
              // Add new for-sale tickets
              for (let i = 0; i < quantity; i++) {
                updatedTickets.push({
                  ...ticketToSplit,
                  ticketId: `${ticketToSplit.ticketId}-forsale-${Date.now()}-${i}`,
                  status: "for-sale" as const,
                  sellPrice: price,
                  price: price,
                  count: 1
                });
              }
            }
          }
          
          return updatedTickets;
        });
        
        setTransactionStatus("success");
      }

      
      if (listResponse.success && listResponse.data) {
        // Update ticket status to listed
        setPurchasedTickets(prev => 
          prev.map(t => 
            t.id === selectedTicket.id 
              ? { ...t, status: "listed", sellPrice: price, price: price }
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
      } else {
        throw new Error(listResponse.error || 'Failed to list ticket');
      }
    } catch (error) {
      console.error('Error listing ticket:', error);
      setIsSelling(false);
      setSelectedTicket(null);
      setTimeout(() => setTransactionStatus(null), 3000);
    }, 2000);
  };

  // Function to handle buying a listed ticket
  const handleBuyListedTicket = (ticket: any) => {
    // Simulate buying process
    setTransactionStatus("pending");
    
    setTimeout(() => {
      // Remove from purchased tickets (someone else bought it)
      setPurchasedTickets(prev => 
        prev.filter(t => t.ticketId !== ticket.ticketId)
      );
      
      setTransactionStatus("success");

      setTimeout(() => setTransactionStatus(null), 3000);
    }
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

  // Function to toggle ticket selection
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  // Get listed tickets (separate from regular purchased tickets)
  const listedTickets = purchasedTickets.filter(ticket => 
    ticket.status === "for-sale" || ticket.status === "listed"
  );

  // Get regular valid tickets
  const validTickets = purchasedTickets.filter(ticket => 
    ticket.status === "valid"
  );

  // Map event IDs to image imports
  const getEventImage = (eventId: string) => {
    switch(eventId) {
      case "1": return neonImg;
      case "2": return summitImg;
      case "3": return cyberpunkImg;
      default: return neonImg;
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

      {/* Navbar - Glassmorphic effect */}
      <div className="backdrop-blur-md bg-background/30 border-b border-border/50 sticky top-0 z-50">
        <Navbar 
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          onWalletConnection={handleWalletConnection}
          scrollToSection={scrollToSection}
        />
      </div>

      {/* Hero Section */}
      <section 
        ref={homeSectionRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center pt-16"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
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
              className="text-lg px-8 py-4 backdrop-blur-sm bg-primary/20 hover:bg-primary/30 border border-primary/30"
              onClick={() => scrollToSection("events")}
            >
              <Zap className="mr-2" />
              Explore Events
            </Button>
          </div>
          
          {/* Contract Info */}
          {contractData && (
            <div className="mt-8 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-white/80 text-sm">
                Contract Data: {contractData.totalSupply?.toString() || 'Loading...'} tickets minted
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Glassmorphic cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Why Choose NFT Tickets?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="p-8 backdrop-blur-sm bg-card/30 border border-border/50 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-card/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-border/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}

          </div>
        </div>
      </section>

      {/* Transaction Status - Glassmorphic */}
      {transactionStatus && (
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-md bg-card/40 rounded-xl border border-border/50 p-1">
              <TransactionStatus
                status={transactionStatus}
                txId={transactionStatus === "success" ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined}
                ticketId={transactionStatus === "success" ? `TKT${Date.now()}` : undefined}
                eventName="Neon Dreams Festival"
                onClose={() => setTransactionStatus(null)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Events Section - Clear images */}
      <section ref={eventsSectionRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="relative overflow-hidden rounded-xl shadow-xl border border-gray-700/50 bg-black/20"
              >
                {/* Clear event image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getEventImage(event.id)})`,
                    filter: 'brightness(0.8)'
                  }}
                ></div>
                
                {/* Overlay with event details */}
                <div className="relative p-6 bg-gradient-to-t from-black/80 to-transparent rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                      {event.category}
                    </Badge>
                    <Badge variant="default" className={event.availableTickets > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {event.availableTickets > 0 ? "Available" : "Sold Out"}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Available</p>
                        <p className="text-green-400 font-medium">{event.availableTickets}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sold</p>
                        <p className="text-blue-400 font-medium">{event.soldTickets}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total</p>
                        <p className="text-gray-300 font-medium">{event.totalTickets}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Burnt</p>
                        <p className="text-red-400 font-medium">{event.burntTickets}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{event.price}</span>
                      <span className="text-sm text-gray-400">STX</span>
                    </div>
                    {event.availableTickets > 0 ? (
                      <Button 
                        variant="default" 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => handleBuyTicket(event.id)}
                        disabled={!isWalletConnected}
                      >
                        Buy NFT Ticket
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled
                      >
                        Sold Out
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* My Tickets Section - Enhanced glassmorphic cards */}
      {(validTickets.length > 0 || isWalletConnected) && (
        <section ref={ticketsSectionRef} className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-16">
              <Wallet className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-bold text-foreground">
                My NFT Tickets
              </h2>
            </div>
            {validTickets.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupTickets(validTickets).map((ticket, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-xl shadow-xl border border-border/50 bg-card/30 backdrop-blur-lg cursor-pointer"
                    onClick={() => toggleTicketSelection(ticket.ticketId)}
                  >
                    {/* Background image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-10"
                      style={{
                        backgroundImage: `url(${getEventImage(
                          events.find(e => e.title === ticket.eventTitle)?.id || "1"
                        )})`
                      }}
                    ></div>
                    
                    {/* Inner card with glassmorphic effect */}
                    <div className="relative p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                      <NFTTicket
                        {...ticket}
                        showTransactionId={selectedTickets[ticket.ticketId]}
                        onViewOnExplorer={() => console.log("View on explorer:", ticket.txHash)}
                        onSell={() => openSellModal(ticket)}
                        onGift={() => openGiftModal(ticket)}
                      />
                    </div>
                  </div>

                ))}
              </div>
            ) : (
              <div className="text-center py-12 backdrop-blur-md bg-card/30 rounded-xl border border-border/50 p-8">
                <p className="text-muted-foreground text-lg">
                  You haven't purchased any tickets yet. Explore events and buy your first NFT ticket!
                </p>
                <Button 
                  variant="default" 
                  className="mt-6 backdrop-blur-sm bg-primary/20 hover:bg-primary/30 border border-primary/30"
                  onClick={() => scrollToSection("events")}
                >
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* My Listings Section - Enhanced glassmorphic cards */}
      {listedTickets.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-16">
              <Store className="w-8 h-8 text-cyan-400" />
              <h2 className="text-4xl font-bold text-foreground">
                My Listings
              </h2>
              <Badge variant="secondary" className="ml-4 bg-cyan-500/20 text-cyan-400">
                {listedTickets.length} {listedTickets.length === 1 ? 'Ticket' : 'Tickets'}
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupTickets(listedTickets).map((ticket, index) => (
                <div 
                  key={`listed-${index}`} 
                  className="relative overflow-hidden rounded-xl shadow-xl border border-border/50 bg-card/30 backdrop-blur-lg cursor-pointer"
                  onClick={() => toggleTicketSelection(ticket.ticketId)}
                >
                  {/* Background image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                      backgroundImage: `url(${getEventImage(
                        events.find(e => e.title === ticket.eventTitle)?.id || "1"
                      )})`
                    }}
                  ></div>
                  
                  {/* Inner card with glassmorphic effect */}
                  <div className="relative p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                    <NFTTicket
                      {...ticket}
                      status="for-sale"
                      showTransactionId={selectedTickets[ticket.ticketId]}
                      onViewOnExplorer={() => console.log("View on explorer:", ticket.txHash)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                These tickets are currently listed for sale on the marketplace
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gifted Tickets Section - Enhanced glassmorphic cards */}
      {giftedTickets.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
              Gifted Tickets
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupTickets(giftedTickets).map((ticket, index) => (
                <div 
                  key={`gifted-${index}`} 
                  className="relative overflow-hidden rounded-xl shadow-xl border border-border/50 bg-card/30 backdrop-blur-lg cursor-pointer"
                  onClick={() => toggleTicketSelection(ticket.ticketId)}
                >
                  {/* Background image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{
                      backgroundImage: `url(${getEventImage(
                        events.find(e => e.title === ticket.eventTitle)?.id || "1"
                      )})`
                    }}
                  ></div>
                  
                  {/* Inner card with glassmorphic effect */}
                  <div className="relative p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                    <NFTTicket
                      {...ticket}
                      status="gifted"
                      showTransactionId={selectedTickets[ticket.ticketId]}
                      onViewOnExplorer={() => console.log("View on explorer:", ticket.txHash)}
                    />
                  </div>
                </div>
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