import { AppConfig, UserSession } from "@stacks/connect";
import { STACKS_TESTNET, StacksNetwork } from "@stacks/network";
import {
  fetchCallReadOnlyFunction,
  contractPrincipalCV,
  uintCV,
  principalCV,
  bufferCV,
  broadcastTransaction,
  makeContractCall,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  cvToString,
  ClarityType,
  TxBroadcastResult,
  StacksTransactionWire
} from "@stacks/transactions";

// Contract constants - UPDATE THESE WITH YOUR DEPLOYED VALUES
const CONTRACT_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = "nft-tickets";
const NETWORK: StacksNetwork = STACKS_TESTNET;

// Helper function to get user session
const appConfig = new AppConfig(["publish_data"]);
const userSession = new UserSession({ appConfig });

// Contract call helper
const callContractFunction = async (functionName: string, args: any[] = []) => {
  try {
    const userData = userSession.loadUserData();
    const userAddress = userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet;
    
    if (!userAddress) {
      throw new Error("User not authenticated");
    }

    const options = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs: args,
      network: NETWORK,
      senderAddress: userAddress,
    };

    const result = await fetchCallReadOnlyFunction(options);
    return result;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
};

// Contract write helper - returns transaction ID
const sendContractCall = async (functionName: string, args: any[], postConditions: any[] = []): Promise<string> => {
  try {
    const userData = userSession.loadUserData();
    const userAddress = userData.profile?.stxAddress?.testnet || userData.profile?.stxAddress?.mainnet;
    
    if (!userAddress) {
      throw new Error("User not authenticated");
    }

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs: args,
      senderKey: userData.appPrivateKey,
      validateWithAbi: false,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions,
    };

    const transaction: StacksTransactionWire = await makeContractCall(txOptions);
    const result: TxBroadcastResult = await broadcastTransaction({ transaction, network: NETWORK });
    
    if ('error' in result) {
      throw new Error(`Transaction failed: ${result.error}`);
    }
    
    return result.txid;
  } catch (error) {
    console.error(`Error sending contract call ${functionName}:`, error);
    throw error;
  }
};

// Smart Contract Functions - CORRECTED TO MATCH YOUR CONTRACT
export const clarityApi = {
  // Mint new ticket
  mintTicket: async (to: string, uri: string): Promise<string> => {
    const args = [
      principalCV(to),
      bufferCV(Buffer.from(uri)),
    ];
    
    const postConditions = [];
    
    return sendContractCall("mint-ticket", args, postConditions);
  },

  // Transfer ticket (gift) - MATCHES YOUR CONTRACT
  transfer: async (tokenId: number, sender: string, recipient: string): Promise<string> => {
    const args = [
      uintCV(tokenId),
      principalCV(sender),
      principalCV(recipient),
    ];
    
    const postConditions = [];
    
    return sendContractCall("transfer", args, postConditions);
  },

  // Safe transfer with price enforcement (sell) - MATCHES YOUR CONTRACT
  safeTransferWithPrice: async (tokenId: number, sender: string, recipient: string, salePrice: number): Promise<string> => {
    const args = [
      uintCV(tokenId),
      principalCV(sender),
      principalCV(recipient),
      uintCV(salePrice),
    ];
    
    const postConditions = [];
    
    return sendContractCall("safe-transfer-with-price", args, postConditions);
  },

  // Approve - MATCHES YOUR CONTRACT
  approve: async (to: string, tokenId: number): Promise<string> => {
    const args = [
      principalCV(to),
      uintCV(tokenId),
    ];
    
    const postConditions = [];
    
    return sendContractCall("approve", args, postConditions);
  },

  // Simplified approval for all - MATCHES YOUR CONTRACT
  setApprovalForAll: async (operator: string, approved: boolean): Promise<string> => {
    const args = [
      principalCV(operator),
      // For boolean in Clarity, you might need to use (true) or (false)
      // This depends on how your contract handles the boolean parameter
    ];
    
    const postConditions = [];
    
    return sendContractCall("set-approval-for-all", args, postConditions);
  },

  // Burn ticket - MATCHES YOUR CONTRACT
  burn: async (tokenId: number): Promise<string> => {
    const args = [
      uintCV(tokenId),
    ];
    
    const postConditions = [];
    
    return sendContractCall("burn", args, postConditions);
  },

  // Read-only functions - CORRECTED TO MATCH YOUR CONTRACT

  getLastTokenId: async (): Promise<number> => {
    const result = await callContractFunction("get-last-token-id");
    const resultString = cvToString(result);
    const match = resultString.match(/\(ok u(\d+)\)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  },

  getTokenUri: async (tokenId: number): Promise<string | null> => {
    const args = [uintCV(tokenId)];
    const result = await callContractFunction("get-token-uri", args);
    
    if (result.type === ClarityType.OptionalSome) {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const valueString = cvToString(result.value);
        const match = valueString.match(/\(some "([^"]+)"\)/);
        if (match) {
          return match[1];
        }
      }
    }
    return null;
  },

  getOwner: async (tokenId: number): Promise<string | null> => {
    const args = [uintCV(tokenId)];
    const result = await callContractFunction("get-owner", args);
    
    if (result.type === ClarityType.OptionalSome) {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const valueString = cvToString(result.value);
        const match = valueString.match(/\(some ([^)]+)\)/);
        if (match) {
          return match[1];
        }
      }
    }
    return null;
  },

  getTotalSupply: async (): Promise<number> => {
    const result = await callContractFunction("get-total-supply");
    const resultString = cvToString(result);
    const match = resultString.match(/\(ok u(\d+)\)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0;
  },

  getTokenPrice: async (tokenId: number): Promise<number | null> => {
    const args = [uintCV(tokenId)];
    const result = await callContractFunction("get-token-price", args);
    
    if (result) {
      const resultString = cvToString(result);
      const match = resultString.match(/u(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return null;
  },

  getApproved: async (tokenId: number): Promise<string | null> => {
    const args = [uintCV(tokenId)];
    const result = await callContractFunction("get-approved", args);
    
    if (result.type === ClarityType.OptionalSome) {
      // @ts-ignore
      if (result.value) {
        // @ts-ignore
        const valueString = cvToString(result.value);
        const match = valueString.match(/\(some ([^)]+)\)/);
        if (match) {
          return match[1];
        }
      }
    }
    return null;
  },

  // CORRECTED FUNCTION NAME TO MATCH YOUR CONTRACT
  canSellAtPrice: async (tokenId: number, salePrice: number): Promise<boolean> => {
    const args = [
      uintCV(tokenId),
      uintCV(salePrice),
    ];
    const result = await callContractFunction("can-sell-at-price?", args); // Note the question mark
    return cvToString(result).includes('true');
  },

  isApprovedForAll: async (owner: string, operator: string): Promise<boolean> => {
    const args = [
      principalCV(owner),
      principalCV(operator),
    ];
    const result = await callContractFunction("is-approved-for-all", args);
    return cvToString(result).includes('true'); // Assuming it returns true when approved
  },
};