import { makeContractDeploy, broadcastTransaction, TxBroadcastResult } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';

// Load private key from environment variable (more secure)
const privateKey = process.env.CONTRACT_DEPLOYER_KEY;

if (!privateKey) {
  console.error('Please set CONTRACT_DEPLOYER_KEY environment variable');
  process.exit(1);
}

async function deployContract() {
  try {
    // Read contract file
    const contractPath = path.join(__dirname, '..', 'contracts', 'nft-tickets.clar');
    
    // Check if file exists
    if (!fs.existsSync(contractPath)) {
      console.error('Contract file not found at:', contractPath);
      process.exit(1);
    }
    
    const contractContent = fs.readFileSync(contractPath, 'utf8');
    
    console.log('Deploying contract...');
    console.log('Contract size:', contractContent.length, 'characters');
    
    const transaction = await makeContractDeploy({
      contractName: 'nft-tickets',
      codeBody: contractContent,
      senderKey: privateKey,
      network: STACKS_TESTNET,
    });

    // Correct usage - only pass the transaction
    const result: TxBroadcastResult = await broadcastTransaction(transaction);
    
    if ('error' in result) {
      console.error('❌ Deployment failed:', result.error);
      process.exit(1);
    } else {
      console.log('✅ Contract deployed successfully!');
      console.log('Transaction ID:', result.txid);
      console.log('Check status at: https://explorer.stacks.co/txid/' + result.txid + '?chain=testnet');
    }
  } catch (error: any) {
    console.error('❌ Error deploying contract:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run deployment
deployContract();