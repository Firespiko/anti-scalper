import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, AlertTriangle } from "lucide-react";

interface SellModalProps {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
  onSell: (price: number) => void;
  isSelling: boolean;
}

export const SellModal = ({ ticket, isOpen, onClose, onSell, isSelling }: SellModalProps) => {
  const [sellPrice, setSellPrice] = useState(ticket.price.toString());
  const [warning, setWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(sellPrice);
    if (!isNaN(price) && price > 0) {
      // Check for overpricing
      if (price > ticket.price * 3) {
        setWarning("Price is more than 3x original - ticket will be burnt!");
      } else {
        setWarning(null);
        onSell(price);
      }
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSellPrice(value);
    
    const price = parseFloat(value);
    if (!isNaN(price) && price > ticket.price * 3) {
      setWarning("Warning: Price is more than 3x original value");
    } else {
      setWarning(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-lg border border-border/50">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-foreground">Sell Ticket</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="mb-6 p-4 bg-card/50 rounded-lg border border-border/50">
            <h4 className="font-semibold text-foreground">{ticket.eventTitle}</h4>
            <p className="text-sm text-muted-foreground">Ticket ID: {ticket.ticketId}</p>
            <p className="text-sm text-muted-foreground">Original Price: {ticket.price} STX</p>
          </div>
          
          {warning && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Sell Price (STX)
              </label>
              <Input
                type="number"
                value={sellPrice}
                onChange={handlePriceChange}
                placeholder="Enter sell price"
                className="w-full"
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set your desired selling price
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
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={isSelling || !sellPrice || parseFloat(sellPrice) <= 0}
              >
                {isSelling ? "Processing..." : "List for Sale"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};