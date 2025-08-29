import { clarityApi } from "./clarity";

export interface Ticket {
  id: string;
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  seatSection?: string;
  price: number;
  status: "valid" | "used" | "burnt" | "listed" | "gifted";
  txHash?: string;
  ownerId: string;
  giftedTo?: string;
  giftDate?: string;
  sellPrice?: number;
  createdAt: string;
  updatedAt: string;
  tokenId?: number; // Clarity token ID
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  availableTickets: number;
  soldTickets: number;
  burntTickets: number;
  totalTickets: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  contractAddress?: string;
}

export interface User {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Transaction status type
export type TransactionStatus = "pending" | "success" | "error" | "fraud" | null;

// Hybrid API that combines backend and Clarity contract
export const ticketApi = {
  // Buy ticket - mints new NFT ticket
  buyTicket: async (userId: string, eventId: string, userWalletAddress: string): Promise<ApiResponse<Ticket>> => {
    try {
      // Mint ticket on Clarity contract
// In your buyTicket function, fix the URI string:
        const txHash = await clarityApi.mintTicket(
        userWalletAddress,
        `https://api.yourapp.com/metadata/tickets/${Date.now()}` // Fixed the string concatenation
        );
      
      // Get the new token ID
      const tokenId = await clarityApi.getLastTokenId();
      
      // Create ticket record in backend
      const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        ticketId: `TKT${Date.now()}`,
        eventTitle: "Sample Event",
        eventDate: "2024-06-15",
        eventLocation: "Sample Venue",
        price: 50,
        status: "valid",
        txHash,
        ownerId: userId,
        tokenId: tokenId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: newTicket
      };
    } catch (error) {
      console.error('Error buying ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to buy ticket'
      };
    }
  },

  // Gift ticket - transfers NFT ticket
  giftTicket: async (ticketId: string, fromUserId: string, toWalletAddress: string, fromWalletAddress: string, tokenId: number): Promise<ApiResponse<Ticket>> => {
    try {
      // Transfer ticket on Clarity contract
      const txHash = await clarityApi.transfer(
        tokenId,
        fromWalletAddress,
        toWalletAddress
      );
      
      // Update ticket status in backend
      const updatedTicket: Ticket = {
        id: ticketId,
        ticketId: `TKT${Date.now()}`,
        eventTitle: "Sample Event",
        eventDate: "2024-06-15",
        eventLocation: "Sample Venue",
        price: 50,
        status: "gifted",
        txHash,
        ownerId: fromUserId,
        giftedTo: toWalletAddress,
        giftDate: new Date().toISOString(),
        tokenId: tokenId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTicket
      };
    } catch (error) {
      console.error('Error gifting ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to gift ticket'
      };
    }
  },

  // List ticket for sale
  listTicket: async (ticketId: string, userId: string, price: number, tokenId: number): Promise<ApiResponse<Ticket>> => {
    try {
      // Check if sale price is valid
      const canSell = await clarityApi.canSellAtPrice(tokenId, price);
      
      if (!canSell) {
        throw new Error('Sale price exceeds face value');
      }
      
      // Update ticket status to listed in backend (no on-chain action needed for listing)
      const updatedTicket: Ticket = {
        id: ticketId,
        ticketId: `TKT${Date.now()}`,
        eventTitle: "Sample Event",
        eventDate: "2024-06-15",
        eventLocation: "Sample Venue",
        price: price,
        status: "listed",
        sellPrice: price,
        ownerId: userId,
        tokenId: tokenId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTicket
      };
    } catch (error) {
      console.error('Error listing ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list ticket'
      };
    }
  },

  // Sell ticket - transfers with price enforcement
  sellTicket: async (ticketId: string, fromUserId: string, toWalletAddress: string, salePrice: number, fromWalletAddress: string, tokenId: number): Promise<ApiResponse<Ticket>> => {
    try {
      // Transfer ticket with price enforcement on Clarity contract
      const txHash = await clarityApi.safeTransferWithPrice(
        tokenId,
        fromWalletAddress,
        toWalletAddress,
        salePrice
      );
      
      // Update ticket status in backend
      const updatedTicket: Ticket = {
        id: ticketId,
        ticketId: `TKT${Date.now()}`,
        eventTitle: "Sample Event",
        eventDate: "2024-06-15",
        eventLocation: "Sample Venue",
        price: salePrice,
        status: "used", // or create a "sold" status
        txHash,
        ownerId: fromUserId,
        tokenId: tokenId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTicket
      };
    } catch (error) {
      console.error('Error selling ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sell ticket'
      };
    }
  },

  // Burn ticket
  burnTicket: async (ticketId: string, userId: string, tokenId: number): Promise<ApiResponse<Ticket>> => {
    try {
      // Burn ticket on Clarity contract
      const txHash = await clarityApi.burn(tokenId);
      
      // Update ticket status in backend
      const updatedTicket: Ticket = {
        id: ticketId,
        ticketId: `TKT${Date.now()}`,
        eventTitle: "Sample Event",
        eventDate: "2024-06-15",
        eventLocation: "Sample Venue",
        price: 50,
        status: "burnt",
        txHash,
        ownerId: userId,
        tokenId: tokenId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: updatedTicket
      };
    } catch (error) {
      console.error('Error burning ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to burn ticket'
      };
    }
  },

  // Get user tickets
  getUserTickets: async (userId: string, userWalletAddress: string): Promise<ApiResponse<Ticket[]>> => {
    try {
      // This would fetch from your backend and verify with Clarity
      // For demo, we'll create mock tickets and verify ownership
      
      // Get total supply to know how many tokens exist
      const totalSupply = await clarityApi.getTotalSupply();
      
      // Check each token to see if user owns it
      const userTickets: Ticket[] = [];
      
      for (let i = 1; i <= totalSupply; i++) {
        try {
          const owner = await clarityApi.getOwner(i);
          if (owner === userWalletAddress) {
            // User owns this token, create ticket record
            const ticket: Ticket = {
              id: `ticket-${i}`,
              ticketId: `TKT${i}`,
              eventTitle: "Sample Event",
              eventDate: "2024-06-15",
              eventLocation: "Sample Venue",
              price: 50,
              status: "valid",
              ownerId: userId,
              tokenId: i,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            userTickets.push(ticket);
          }
        } catch (error) {
          // Token doesn't exist or other error, continue
          continue;
        }
      }
      
      return {
        success: true,
        data: userTickets
      };
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tickets'
      };
    }
  },

  // Get gifted tickets
  getGiftedTickets: async (userId: string): Promise<ApiResponse<Ticket[]>> => {
    try {
      // This would fetch gifted tickets from your backend
      const tickets: Ticket[] = [
        {
          id: "2",
          ticketId: "TKT002",
          eventTitle: "Another Event",
          eventDate: "2024-07-20",
          eventLocation: "Another Venue",
          price: 75,
          status: "gifted",
          ownerId: userId,
          giftedTo: "ST2PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          tokenId: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return {
        success: true,
        data: tickets
      };
    } catch (error) {
      console.error('Error fetching gifted tickets:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch gifted tickets'
      };
    }
  }
};