# Anti-Scalper Ticketing dApp 🎫

A revolutionary decentralized application built on the Stacks blockchain that transforms event ticketing by implementing automatic anti-scalping mechanisms directly into the smart contract layer. This project combines the security of Bitcoin with the flexibility of smart contracts to create a fair, transparent, and tamper-proof ticketing system.

Deployed Smart Contract - https://explorer.hiro.so/txid/0x0f7dbe9bcf042055b7e5786943da1adadb2856df20328b9904ad3a41f830a990?chain=testnet

Demo: [Watch Video on Loom](https://www.loom.com/embed/6917476e4cb44280b3a9056b28c3173e?sid=3933c1a4-14f3-4858-bb9b-4fecaef3f34d)

---

## 🚀 Why This Project Matters

### The Ticketing Industry Problem

The global event ticketing industry is plagued by several critical issues:

- **Scalping Epidemic**: Automated bots purchase tickets in bulk within seconds of release, artificially inflating prices by 300-1000%
- **Market Manipulation**: Secondary markets are controlled by large resellers who create artificial scarcity
- **Consumer Exploitation**: Fans pay excessive markups while legitimate buyers are priced out
- **Lack of Transparency**: Traditional ticketing systems are opaque, making it impossible to verify authenticity
- **Counterfeiting**: Fake tickets cause financial loss and venue security issues
- **Platform Monopolies**: Centralized platforms charge excessive fees and control the entire ecosystem

### Our Revolutionary Solution

This Anti-Scalper Ticketing dApp addresses these problems through innovative blockchain technology:

#### 🔒 **Built-in Anti-Scalping Mechanisms**
- **Fixed Price Cap**: Smart contracts automatically reject any resale above the original face value
- **Burn Fee Implementation**: Resellers pay a mandatory burn fee that removes value from the ecosystem, making scalping unprofitable
- **Transparent Pricing**: All pricing rules are encoded in immutable smart contracts

#### 🌐 **Decentralized Ownership**
- **True Digital Ownership**: Tickets exist as NFTs with cryptographic proof of ownership
- **No Platform Lock-in**: Users own their tickets independently of any centralized platform
- **Interoperable**: Tickets can be used across different platforms and services

#### 🔍 **Complete Transparency**
- **Public Verification**: Anyone can verify ticket authenticity on the blockchain
- **Transaction History**: Complete audit trail of all ticket transfers and sales
- **Open Source**: All code is publicly auditable for trust and security

#### 💰 **Economic Fairness**
- **Fair Distribution**: Eliminates bot advantages through blockchain-based issuance
- **Reduced Fees**: No intermediary platforms taking excessive cuts
- **Value Protection**: Anti-scalping mechanisms protect consumer purchasing power

---

## 🏗️ Technical Architecture & Innovation

### Blockchain Foundation: Stacks + Bitcoin

This project leverages the unique capabilities of the Stacks blockchain:

- **Bitcoin Security**: Inherits the security and decentralization of the Bitcoin network
- **Smart Contract Functionality**: Enables complex business logic impossible on Bitcoin alone
- **Clarity Language**: Uses a decidable, predictable smart contract language designed for security
- **Lower Costs**: More affordable than Ethereum while maintaining security

### Smart Contract Design Philosophy

Our Clarity smart contract implements several innovative features:

#### **Dynamic Pricing Enforcement**
```clarity
;; Automatically enforces face value cap on all secondary sales
(define-constant FACE-VALUE u100)
(asserts! (<= sale-price FACE-VALUE) (err ERR-PRICE-EXCEEDED))
```

#### **Economic Disincentives**
```clarity
;; Burn fee makes scalping economically unviable
(define-constant BURN-FEE u10)
(try! (stx-burn? BURN-FEE tx-sender))
```

#### **Flexible Transfer Models**
- **Gift Transfers**: Free transfers between users for legitimate sharing
- **Commercial Transfers**: Regulated sales with anti-scalping enforcement
- **Approval System**: Delegated transfers for marketplace integration

### Frontend Innovation

Our React frontend demonstrates cutting-edge Web3 UX:

- **Seamless Wallet Integration**: Support for Leather and Hiro wallets
- **Real-time Blockchain State**: Live updates from smart contract state
- **Intuitive NFT Management**: User-friendly ticket viewing and management
- **Transaction Transparency**: Clear feedback on all blockchain interactions

### IPFS Integration

Decentralized metadata storage ensures:

- **Censorship Resistance**: Ticket data cannot be removed or manipulated
- **Performance**: Fast content delivery through IPFS network
- **Cost Efficiency**: Reduced on-chain storage costs
- **Rich Media Support**: Images, videos, and detailed ticket information

---

## 🎯 Key Benefits & Use Cases

### For Event Organizers

#### **Revenue Protection**
- Eliminate scalpers capturing value that should belong to organizers
- Maintain control over ticket pricing throughout the sales cycle
- Create fair distribution mechanisms for high-demand events

#### **Brand Protection**
- Prevent negative customer experiences caused by inflated secondary market prices
- Ensure tickets reach genuine fans, not resellers
- Maintain brand integrity through transparent, fair processes

#### **Data Ownership**
- Own customer relationships directly without platform intermediaries
- Access complete transaction history and fan engagement data
- Build direct marketing channels to ticket holders

### For Consumers

#### **Price Protection**
- Guaranteed protection against scalping markups
- Transparent pricing with no hidden fees or manipulation
- Access to face-value tickets even in secondary markets

#### **Authenticity Guarantee**
- Cryptographic proof of ticket authenticity
- No risk of counterfeit tickets
- Verifiable ownership and transfer history

#### **True Ownership**
- Own tickets as digital assets in personal wallets
- Freedom to gift or resell within anti-scalping rules
- No dependence on centralized platforms

### For the Industry

#### **Market Efficiency**
- Reduced artificial scarcity and price manipulation
- Lower transaction costs through disintermediation
- Increased market liquidity through standardized NFT format

#### **Innovation Platform**
- Foundation for new business models and services
- Integration possibilities with other blockchain applications
- Open ecosystem encouraging innovation

---

## 🛠️ Technical Implementation Guide

### Project Structure Deep Dive

```
.
├── anti-scalper                    # Smart Contract Layer
│   ├── Clarinet.toml               # Project configuration
│   ├── contracts
│   │   └── anti-scalper.clar       # Core business logic
│   ├── deployments                 # Network deployment configs
│   │   ├── default.simnet-plan.yaml
│   │   └── default.testnet-plan.yaml
│   ├── settings                    # Network connection settings
│   │   ├── Devnet.toml
│   │   └── Testnet.toml
│   └── tests
│       └── anti-scalper.test.ts    # Comprehensive test suite
└── frontend                        # User Interface Layer
    ├── src
    │   ├── components              # Reusable UI components
    │   │   ├── EventCard.tsx       # Event display component
    │   │   ├── GiftModal.tsx       # Ticket gifting interface
    │   │   ├── Navbar.tsx          # Navigation component
    │   │   ├── NFTTicket.tsx       # Ticket visualization
    │   │   ├── SellModal.tsx       # Regulated selling interface
    │   │   ├── WalletConnect.tsx   # Wallet integration
    │   │   └── ui/                 # Shadcn/ui component library
    │   ├── services               # Business logic layer
    │   │   ├── api.ts             # External API integrations
    │   │   └── clarity.ts         # Smart contract interactions
    │   ├── pages                  # Application routing
    │   └── scripts
    │       └── deploy-contracts.ts # Deployment automation
    └── public                     # Static assets
```

---

## 🚀 Setup & Installation Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or later) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Docker** - For local blockchain development
- **Clarinet CLI** - Stacks development environment
- **Git** - Version control

### Step 1: Clone and Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/anti-scalper-ticketing-dapp.git
cd anti-scalper-ticketing-dapp

# Install Clarinet (macOS)
brew install clarinet

# Or download from GitHub releases for other platforms
```

### Step 2: Smart Contract Development

```bash
# Navigate to smart contract directory
cd anti-scalper

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start local development network
clarinet devnet start
```

### Step 3: Configure Networks

Create `settings/Testnet.toml`:

```toml
[network]
name = "testnet"
stacks_node_rpc_address = "https://api.testnet.hiro.so"
bitcoin_node_rpc_address = "http://blockstack:blockstacksystem@bitcoind.testnet.stacks.co:18332"
deployment_fee_rate = 10

[accounts.deployer]
# Replace with your actual testnet mnemonic
mnemonic = "your twenty four word mnemonic phrase goes here replace with actual wallet seed"
balance = 100000000000

[accounts.wallet_1]
mnemonic = "second test wallet mnemonic for multi user testing scenarios"
balance = 100000000000
```

### Step 4: Deploy to Testnet

```bash
# Generate deployment plan
clarinet deployment generate --testnet --low-cost

# Deploy to testnet (requires STX in wallet)
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

**Note your deployed contract address** - you'll need this for frontend configuration.

### Step 5: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Update `.env` with your contract details:

```bash
VITE_NETWORK=testnet
VITE_CONTRACT_ADDRESS=ST3TVNJ5M6DPK63RF9PCVBMZ7VHA0EBK8NFAPY55P
VITE_CONTRACT_NAME=anti-scalper
```

### Step 6: Update Contract Configuration

Edit `src/services/clarity.ts` and update the contract constants:

```typescript
const CONTRACT_ADDRESS = "ST3TVNJ5M6DPK63RF9PCVBMZ7VHA0EBK8NFAPY55P";
const CONTRACT_NAME = "anti-scalper";
const NETWORK = new StacksTestnet();
```

### Step 7: Launch Development Server

```bash
# Start the frontend development server
npm run dev

# Open browser to http://localhost:5173
```

---

## 🎮 Usage Guide & Examples

### Getting Started with the dApp

1. **Install Wallet Extension**
   - Install [Leather](https://leather.io) or [Hiro Wallet](https://wallet.hiro.so)
   - Create or import a wallet
   - Switch to Stacks Testnet
   - Get testnet STX from the [faucet](https://explorer.stacks.co/sandbox/faucet?chain=testnet)

2. **Connect Your Wallet**
   - Click "Connect Wallet" in the dApp
   - Approve the connection request
   - Your address should appear in the navigation

### Minting Your First Ticket

1. **Prepare Metadata**
   ```json
   {
     "name": "Taylor Swift Concert - Section A, Row 5, Seat 12",
     "description": "Premium ticket for Taylor Swift Eras Tour at Madison Square Garden",
     "image": "ipfs://QmYourImageHash",
     "attributes": [
       {"trait_type": "Event", "value": "Taylor Swift Eras Tour"},
       {"trait_type": "Venue", "value": "Madison Square Garden"},
       {"trait_type": "Date", "value": "2024-08-15"},
       {"trait_type": "Section", "value": "A"},
       {"trait_type": "Row", "value": "5"},
       {"trait_type": "Seat", "value": "12"}
     ]
   }
   ```

2. **Upload to IPFS**
   - Use [Pinata](https://pinata.cloud), [NFT.Storage](https://nft.storage), or similar
   - Upload your metadata JSON file
   - Copy the IPFS URI (e.g., `ipfs://QmHash...`)

3. **Mint Through dApp**
   - Navigate to the "Mint Ticket" section
   - Paste your IPFS URI
   - Specify recipient address
   - Confirm transaction in wallet
   - Wait for blockchain confirmation

### Transferring Tickets

#### **Gift Transfer (Free)**
```typescript
// Example: Gifting a ticket to a friend
const giftTicket = async () => {
  await contractAPI.transfer(
    tokenId,
    senderAddress,
    friendAddress
  );
};
```

#### **Regulated Sale**
```typescript
// Example: Selling at or below face value
const sellTicket = async () => {
  await contractAPI.safeTransferWithPrice(
    tokenId,
    sellerAddress,
    buyerAddress,
    salePrice  // Must be <= FACE_VALUE
  );
};
```

### Viewing Ticket Information

```typescript
// Get ticket owner
const owner = await contractAPI.getOwner(tokenId);

// Get ticket metadata URI
const uri = await contractAPI.getTokenUri(tokenId);

// Get total supply
const totalSupply = await contractAPI.getTotalSupply();

// Check if ticket can be sold at a specific price
const canSell = await contractAPI.canSellAtPrice(tokenId, proposedPrice);
```

---

## 🔒 Security & Best Practices

### Smart Contract Security

Our contract implements multiple security layers:

#### **Access Control**
```clarity
;; Only token owner can transfer
(asserts! (is-eq tx-sender owner) (err ERR-NOT-AUTHORIZED))
```

#### **Input Validation**
```clarity
;; Validate price constraints
(asserts! (<= sale-price FACE-VALUE) (err ERR-PRICE-EXCEEDED))
```

#### **Economic Security**
```clarity
;; Burn fee prevents profit from scalping
(asserts! (>= (stx-get-balance tx-sender) BURN-FEE) (err ERR-INSUFFICIENT-BALANCE))
(try! (stx-burn? BURN-FEE tx-sender))
```

### Frontend Security

- **Wallet Integration**: Secure connection handling without exposing private keys
- **Transaction Validation**: All transactions validated before submission
- **Error Handling**: Comprehensive error handling for failed transactions
- **State Management**: Proper synchronization with blockchain state

### Operational Security

1. **Seed Phrase Management**
   - Never commit mnemonics to version control
   - Use environment variables or secure key management
   - Backup seed phrases securely offline

2. **Network Configuration**
   - Validate network settings before deployment
   - Use official RPC endpoints
   - Monitor for network issues

3. **Contract Verification**
   - Verify deployed contracts on block explorer
   - Test all functions on testnet first
   - Monitor contract activity post-deployment

---

## 🧪 Testing & Quality Assurance

### Comprehensive Test Suite

Our testing strategy covers multiple layers:

#### **Unit Tests**
```typescript
// Example test case
describe("Anti-Scalper Contract", () => {
  it("should reject sales above face value", async () => {
    const result = await contractCall({
      function: "safe-transfer-with-price",
      args: [tokenId, sender, buyer, excessivePrice]
    });
    
    expect(result).toEqual(Err(ERR_PRICE_EXCEEDED));
  });
});
```

#### **Integration Tests**
- Wallet connection flows
- End-to-end ticket lifecycle
- IPFS metadata retrieval
- Cross-browser compatibility

#### **Load Testing**
- Multiple concurrent transactions
- High-volume minting scenarios
- Network congestion handling

### Running Tests

```bash
# Smart contract tests
cd anti-scalper
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 🌍 Deployment Strategies

### Development Workflow

1. **Local Development**
   ```bash
   clarinet devnet start
   npm run dev
   ```

2. **Testnet Deployment**
   ```bash
   clarinet deployment apply -p deployments/default.testnet-plan.yaml
   ```

3. **Mainnet Deployment**
   ```bash
   clarinet deployment apply -p deployments/default.mainnet-plan.yaml
   ```

### Production Considerations

#### **Mainnet Deployment Checklist**
- [ ] Comprehensive testing on testnet
- [ ] Security audit completed
- [ ] Gas cost optimization
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup
- [ ] Documentation updated

#### **Frontend Deployment**
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with CI/CD
- **IPFS**: Decentralized hosting option

---

## 🔮 Future Roadmap & Extensions

### Phase 1: Core Platform (Current)
- ✅ Basic anti-scalping smart contract
- ✅ React frontend with wallet integration
- ✅ IPFS metadata storage
- ✅ Testnet deployment

### Phase 2: Enhanced Features
- 🔄 Dynamic pricing models
- 🔄 Batch minting for events
- 🔄 Advanced approval mechanisms
- 🔄 Mobile application

### Phase 3: Ecosystem Integration
- 📅 Multi-chain deployment
- 📅 Marketplace integration
- 📅 Event organizer dashboard
- 📅 Analytics and reporting

### Phase 4: Advanced Capabilities
- 📅 AI-powered demand prediction
- 📅 Dynamic anti-scalping parameters
- 📅 Cross-event ticket exchanges
- 📅 Loyalty and rewards programs

### Potential Extensions

#### **Multi-Event Management**
```clarity
(define-map event-tickets uint (list 1000 uint))
(define-map event-details uint {
  name: (string-ascii 100),
  venue: (string-ascii 100),
  date: uint,
  capacity: uint
})
```

#### **Dynamic Pricing Models**
```clarity
(define-read-only (calculate-dynamic-price (token-id uint) (demand-factor uint))
  (let ((base-price (unwrap! (map-get? token-price token-id) u0)))
    (* base-price demand-factor)))
```

#### **Staking and Rewards**
```clarity
(define-map staked-tokens uint uint)
(define-data-var reward-rate uint u5)

(define-public (stake-ticket (token-id uint))
  ;; Implementation for ticket staking rewards
  (ok true))
```

---

### Team Members

- K.S.Adithya
- Tharun D
- Sai Abhishek CH

## 📄 License & Legal

This project is licensed under the **MIT License**, allowing for:

- ✅ Commercial use
- ✅ Modification and distribution
- ✅ Private use
- ✅ Patent use

### Disclaimer

This software is provided "as is" without warranty. Users are responsible for:

- Understanding blockchain and cryptocurrency risks
- Complying with local laws and regulations
- Securing their private keys and funds
- Conducting due diligence before using in production

---

## 🆘 Support & Resources

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Discord Community**: Join our developer community
- **Documentation**: Comprehensive guides and tutorials
- **Stack Overflow**: Tag questions with `stacks-blockchain`

### Useful Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://book.clarity-lang.org/)
- [Hiro Developer Tools](https://www.hiro.so/)
- [Leather Wallet](https://leather.io/)
- [IPFS Documentation](https://docs.ipfs.io/)

---

*Built with ❤️ on the Stacks blockchain. Powered by Bitcoin's security.*