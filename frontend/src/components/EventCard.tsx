import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Zap } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  currency?: string;
  availableTickets: number;
  totalTickets: number;
  soldTickets: number;
  burntTickets: number;
  image?: string;
  category: string;
  onBuyTicket: (eventId: string) => void;
  walletConnected: boolean;
}

export const EventCard = ({
  id,
  title,
  date,
  location,
  price,
  currency = "STX",
  availableTickets,
  totalTickets,
  soldTickets,
  burntTickets,
  image,
  category,
  onBuyTicket,
  walletConnected
}: EventCardProps) => {
  const isAvailable = availableTickets > 0;
  const soldOut = availableTickets === 0;

  return (
    <Card className="overflow-hidden bg-gradient-card border-accent/20 hover:border-accent/40 transition-all duration-300 group">
      <div className="aspect-video bg-gradient-holographic relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-holographic flex items-center justify-center">
            <Zap className="w-12 h-12 text-primary-foreground/60" />
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary/80 text-primary-foreground">
            {category}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          {soldOut ? (
            <Badge className="bg-destructive/80 text-destructive-foreground">
              Sold Out
            </Badge>
          ) : (
            <Badge className="bg-success/80 text-success-foreground">
              Available
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Ticket Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Available</div>
            <div className="text-lg font-semibold text-success">{availableTickets}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Sold</div>
            <div className="text-lg font-semibold text-accent">{soldTickets}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-semibold text-foreground">{totalTickets}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Burnt</div>
            <div className="text-lg font-semibold text-fraud">{burntTickets}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">
            {price} <span className="text-lg text-accent">{currency}</span>
          </div>
          
          <Button
            variant={soldOut ? "outline" : (walletConnected ? "nft" : "wallet")}
            disabled={soldOut || !walletConnected}
            onClick={() => onBuyTicket(id)}
            className="min-w-[120px]"
          >
            {soldOut ? "Sold Out" : 
             !walletConnected ? "Connect Wallet First" : 
             "Buy NFT Ticket"}
          </Button>
        </div>
      </div>
    </Card>
  );
};