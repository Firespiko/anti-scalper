import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Gift, 
  Tag, 
  Calendar, 
  MapPin, 
  Hash,
  Eye
} from "lucide-react";

interface NFTTicketProps {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  price: number;
  status: "valid" | "used" | "burnt" | "listed" | "gifted" | "for-sale";
  txHash?: string;
  count?: number;
  giftedTo?: string;
  giftDate?: string;
  sellPrice?: number;
  showTransactionId?: boolean;
  onViewOnExplorer?: () => void;
  onSell?: () => void;
  onGift?: () => void;
}

export const NFTTicket = ({
  ticketId,
  eventTitle,
  eventDate,
  eventLocation,
  price,
  status,
  txHash,
  count = 1,
  giftedTo,
  giftDate,
  sellPrice,
  showTransactionId = false,
  onViewOnExplorer,
  onSell,
  onGift
}: NFTTicketProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "valid":
        return <Badge variant="default">Valid</Badge>;
      case "used":
        return <Badge variant="secondary">Used</Badge>;
      case "burnt":
        return <Badge variant="destructive">Burnt</Badge>;
      case "listed":
      case "for-sale":
        return <Badge variant="outline" className="border-cyan-500 text-cyan-500">For Sale</Badge>;
      case "gifted":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Gifted</Badge>;
      default:
        return <Badge variant="default">Valid</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-foreground">{eventTitle}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge()}
            {count > 1 && (
              <Badge variant="secondary" className="ml-2">
                x{count}
              </Badge>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => {
            e.stopPropagation();
            onViewOnExplorer?.();
          }}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{eventDate}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{eventLocation}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Tag className="w-4 h-4" />
          <span className="font-medium">
            {sellPrice ? `${sellPrice} STX` : `${price} STX`}
            {sellPrice && sellPrice !== price && (
              <span className="text-xs text-muted-foreground ml-2 line-through">
                {price} STX
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Hash className="w-4 h-4" />
          <span className="font-mono text-xs">
            {ticketId.slice(0, 8)}...{ticketId.slice(-4)}
          </span>
        </div>
        
        {showTransactionId && txHash && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="font-mono text-xs">
              TX: {txHash.slice(0, 8)}...{txHash.slice(-4)}
            </span>
          </div>
        )}
        
        {status === "gifted" && giftedTo && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Gifted to: <span className="font-mono text-xs">{giftedTo.slice(0, 6)}...{giftedTo.slice(-4)}</span>
            </p>
            {giftDate && (
              <p className="text-xs text-muted-foreground mt-1">
                on {giftDate}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Always visible action buttons */}
      {status === "valid" && (
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-primary/10 hover:bg-primary/20 border border-primary/20"
            onClick={(e) => {
              e.stopPropagation();
              onSell?.();
            }}
          >
            <Tag className="w-4 h-4 mr-2" />
            Sell
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onGift?.();
            }}
          >
            <Gift className="w-4 h-4 mr-2" />
            Gift
          </Button>
        </div>
      )}
    </div>
  );
};