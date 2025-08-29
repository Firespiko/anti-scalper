import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertTriangle, Clock, AlertCircle } from "lucide-react";

export type TransactionStatusType = "pending" | "success" | "error" | "fraud" | null;

interface TransactionStatusProps {
  status: TransactionStatusType;
  txId?: string;
  ticketId?: string;
  eventName?: string;
  onClose: () => void;
}

export const TransactionStatus = ({ 
  status, 
  txId, 
  ticketId, 
  eventName,
  onClose 
}: TransactionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-6 h-6 text-yellow-500" />,
          title: "Processing Transaction",
          message: "Your transaction is being processed on the blockchain...",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          textColor: "text-yellow-700 dark:text-yellow-300"
        };
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6 text-success" />,
          title: "Transaction Successful!",
          message: `Ticket ${ticketId} for ${eventName} has been purchased successfully.`,
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
          textColor: "text-success"
        };
      case "error":
        return {
          icon: <AlertCircle className="w-6 h-6 text-destructive" />,
          title: "Transaction Failed",
          message: "There was an error processing your transaction. Please try again.",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          textColor: "text-destructive"
        };
      case "fraud":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-warning" />,
          title: "Fraud Detection Triggered",
          message: "Suspicious activity detected. Transaction has been flagged and ticket burned.",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/20",
          textColor: "text-warning"
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <Card className={`p-6 ${config.bgColor} ${config.borderColor} border`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {config.icon}
          <div>
            <h3 className={`font-bold text-lg ${config.textColor}`}>
              {config.title}
            </h3>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <p className={`mb-4 ${config.textColor}`}>
        {config.message}
      </p>
      
      {txId && (
        <div className="text-sm text-muted-foreground font-mono break-all">
          Transaction ID: {txId.slice(0, 8)}...{txId.slice(-6)}
        </div>
      )}
    </Card>
  );
};