import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Calendar, MapPin, Ticket, ExternalLink, Gift, Tag } from "lucide-react";

interface NFTTicketProps {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatSection?: string;
  price: number;
  currency?: string;
  status: "valid" | "used" | "burnt" | "listed" | "gifted";
  txHash?: string;
  count?: number;
  giftedTo?: string;
  giftDate?: string;
  sellPrice?: number;
  onViewOnExplorer?: () => void;
  onSell?: () => void;
  onGift?: () => void;
  // For grouped tickets, we might have multiple transaction IDs
  transactionIds?: string[];
}

export const NFTTicket = ({
  ticketId,
  eventTitle,
  eventDate,
  eventLocation,
  seatSection,
  price,
  currency = "STX",
  status,
  txHash,
  count = 1,
  giftedTo,
  giftDate,
  sellPrice,
  onViewOnExplorer,
  onSell,
  onGift,
  transactionIds
}: NFTTicketProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case "valid":
        return {
          badge: "Valid",
          badgeClass: "bg-success text-success-foreground",
          cardClass: "border-success/30 shadow-success",
        };
      case "used":
        return {
          badge: "Used",
          badgeClass: "bg-muted text-muted-foreground",
          cardClass: "border-muted/30 opacity-75",
        };
      case "burnt":
        return {
          badge: "Burnt (Fraud)",
          badgeClass: "bg-destructive text-destructive-foreground",
          cardClass: "border-destructive/30 shadow-destructive opacity-60",
        };
      case "listed":
        return {
          badge: "Listed for Sale",
          badgeClass: "bg-yellow-500 text-yellow-900",
          cardClass: "border-yellow-500/30 shadow-yellow-500/20",
        };
      case "gifted":
        return {
          badge: "Gifted",
          badgeClass: "bg-accent text-accent-foreground",
          cardClass: "border-accent/30 opacity-75",
        };
      default:
        return {
          badge: "Unknown",
          badgeClass: "bg-muted text-muted-foreground",
          cardClass: "border-muted/30",
        };
    }
  };

  const config = getStatusConfig();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewOnExplorer = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking explorer button
    if (onViewOnExplorer) {
      onViewOnExplorer();
    }
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking sell button
    if (onSell) {
      onSell();
    }
  };

  const handleGiftClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion when clicking gift button
    if (onGift) {
      onGift();
    }
  };

  return (
    <Card 
      className={`overflow-hidden bg-gradient-card ${config.cardClass} relative cursor-pointer`}
      onClick={toggleExpand}
    >
      {/* Holographic Header */}
      <div className="bg-gradient-holographic p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary-foreground/20">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="text-primary-foreground font-bold text-lg">NFT TICKET</div>
              <div className="text-primary-foreground/80 text-sm font-mono">#{ticketId}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={config.badgeClass}>
              {config.badge}
            </Badge>
            {count > 1 && (
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                x{count}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl text-foreground mb-4">{eventTitle}</h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-foreground">{eventDate}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-foreground">{eventLocation}</span>
          </div>
          
          {seatSection && (
            <div className="flex items-center gap-3">
              <Ticket className="w-4 h-4 text-accent" />
              <span className="text-foreground">Section: {seatSection}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Price: <span className="text-foreground font-semibold">{price} {currency}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {status === "valid" && (
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
            )}
            
            {(onViewOnExplorer || txHash) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewOnExplorer}
                disabled={!txHash && !onViewOnExplorer}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            {/* Transaction IDs for grouped tickets */}
            {transactionIds && transactionIds.length > 0 && (
              <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                <h4 className="text-sm font-semibold text-foreground mb-2">Transaction IDs ({transactionIds.length}):</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {transactionIds.map((id, index) => (
                    <div key={index} className="text-xs font-mono text-muted-foreground break-all">
                      {id.slice(0, 8)}...{id.slice(-6)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for valid tickets */}
            {status === "valid" && (onSell || onGift) && (
              <div className="flex gap-2">
                {onSell && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-500/10"
                    onClick={handleSellClick}
                  >
                    <Tag className="w-4 h-4" />
                    Sell
                  </Button>
                )}
                {onGift && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 flex items-center gap-2 border-violet-500/30 text-violet-600 hover:bg-violet-500/10"
                    onClick={handleGiftClick}
                  >
                    <Gift className="w-4 h-4" />
                    Gift
                  </Button>
                )}
              </div>
            )}

            {/* Listed Status Info */}
            {status === "listed" && (
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-semibold">Listed for sale</span>
                  <br />
                  Current price: {sellPrice || price} {currency}
                </p>
              </div>
            )}

            {/* Gifted Status Info */}
            {status === "gifted" && (
              <div className="space-y-3">
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent-foreground">
                    <span className="font-semibold">Gifted to another wallet</span>
                    {giftDate && <span className="block">on {giftDate}</span>}
                  </p>
                </div>
                
                {giftedTo && (
                  <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Current Holder:</h4>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {giftedTo.slice(0, 6)}...{giftedTo.slice(-4)}
                    </p>
                  </div>
                )}
                
                {txHash && (
                  <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Transaction ID:</h4>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {txHash.slice(0, 8)}...{txHash.slice(-6)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Single ticket transaction info */}
            {status !== "gifted" && status !== "listed" && txHash && !transactionIds && (
              <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                <h4 className="text-sm font-semibold text-foreground mb-1">Transaction ID:</h4>
                <p className="text-xs font-mono text-muted-foreground break-all">
                  {txHash.slice(0, 8)}...{txHash.slice(-6)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};