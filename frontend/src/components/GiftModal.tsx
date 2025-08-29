import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface GiftModalProps {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
  onGift: (receiverAddress: string) => void;
  isGifting: boolean;
}

export const GiftModal = ({ ticket, isOpen, onClose, onGift, isGifting }: GiftModalProps) => {
  const [receiverAddress, setReceiverAddress] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiverAddress.trim()) {
      onGift(receiverAddress.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Gift Ticket</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-foreground">{ticket.eventTitle}</h4>
            <p className="text-sm text-muted-foreground">Ticket ID: {ticket.ticketId}</p>
            <p className="text-sm text-muted-foreground">Price: {ticket.price} STX</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Receiver's Wallet Address
              </label>
              <Input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the Stacks wallet address of the recipient
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                disabled={isGifting || !receiverAddress.trim()}
              >
                {isGifting ? "Gifting..." : "Gift Ticket"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};