import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Flame, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TransactionStatus = "pending" | "success" | "fraud" | "failed";

interface TransactionStatusProps {
  txId?: string;
  status: TransactionStatus;
  ticketId?: string;
  eventName?: string;
  onClose?: () => void;
}

export const TransactionStatus = ({ 
  txId, 
  status, 
  ticketId, 
  eventName,
  onClose 
}: TransactionStatusProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          title: "Transaction Successful!",
          description: "Your NFT ticket has been minted successfully",
          badgeText: "Success",
          badgeClass: "bg-success text-success-foreground",
          cardClass: "border-success/30 shadow-success",
        };
      case "fraud":
        return {
          icon: Flame,
          title: "Fraud Detected - Ticket Burnt",
          description: "Suspicious activity detected. The ticket has been permanently destroyed",
          badgeText: "Fraud Detected",
          badgeClass: "bg-fraud text-fraud-foreground",
          cardClass: "border-fraud/30 shadow-fraud",
        };
      case "failed":
        return {
          icon: AlertTriangle,
          title: "Transaction Failed",
          description: "The transaction could not be completed. Please try again",
          badgeText: "Failed",
          badgeClass: "bg-destructive text-destructive-foreground",
          cardClass: "border-destructive/30",
        };
      default:
        return {
          icon: Clock,
          title: "Transaction Pending",
          description: "Your transaction is being processed on the blockchain",
          badgeText: "Pending",
          badgeClass: "bg-muted text-muted-foreground",
          cardClass: "border-muted/30 animate-pulse",
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className={`p-6 bg-gradient-card ${config.cardClass}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${
          status === "success" ? "bg-success/10 border border-success/20" :
          status === "fraud" ? "bg-fraud/10 border border-fraud/20" :
          status === "failed" ? "bg-destructive/10 border border-destructive/20" :
          "bg-muted/10 border border-muted/20"
        }`}>
          <StatusIcon className={`w-6 h-6 ${
            status === "success" ? "text-success" :
            status === "fraud" ? "text-fraud" :
            status === "failed" ? "text-destructive" :
            "text-muted-foreground"
          }`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground">{config.title}</h3>
            <Badge className={config.badgeClass}>{config.badgeText}</Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{config.description}</p>

          {eventName && (
            <div className="mb-3">
              <span className="text-sm font-medium text-foreground">Event: </span>
              <span className="text-sm text-muted-foreground">{eventName}</span>
            </div>
          )}

          {ticketId && status === "success" && (
            <div className="mb-3">
              <span className="text-sm font-medium text-foreground">Ticket NFT ID: </span>
              <span className="text-sm text-accent font-mono">#{ticketId}</span>
            </div>
          )}

          {txId && (
            <div className="mb-4">
              <span className="text-sm font-medium text-foreground">Transaction ID: </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground font-mono">
                  {txId.slice(0, 8)}...{txId.slice(-8)}
                </span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};