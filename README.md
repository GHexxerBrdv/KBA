# Smart Account Platform (KBA)

A modern web application built with React and Vite that allows users to interact with EIP-4337 compliant smart contract accounts (Account Abstraction).

## Features

- **Connect Wallet**: Seamlessly connect your MetaMask wallet
- **Deploy Smart Accounts**: Create EIP-4337 compliant smart contract accounts
- **Fund Accounts**: Send ETH to your smart account to use for transactions
- **Execute Transactions**: Send ETH from your smart account to any address
- **Contract Interaction**: Interact with any smart contract using your account

## Technologies Used

- React 19 with Hooks
- Vite for fast development and building
- Ethers.js for Ethereum interactions
- PrimeReact components for UI
- PrimeFlex for responsive layout

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/kba.git
   cd kba
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage Guide

### Connecting Your Wallet

1. Click the "Connect MetaMask" button
2. Approve the connection request in your MetaMask popup
3. Once connected, you'll see your wallet address, network, and balance

### Deploying a Smart Account

1. Ensure your wallet is connected
2. The default EntryPoint address is pre-filled
3. Click "Deploy Minimal Account"
4. After deployment, your smart account details will be displayed

### Funding Your Smart Account

1. Enter the amount of ETH you want to send to your smart account
2. Click "Fund Account"
3. Approve the transaction in MetaMask
4. Your smart account's balance will update after the transaction confirms

## Smart Account Architecture

This application implements EIP-4337 Account Abstraction, allowing users to:

- Create smart contract wallets with advanced features
- Execute transactions that get validated by an EntryPoint contract
- Define custom verification logic for transactions
- Bundle multiple transactions together
- Sponsor gas fees for other users

## Development

### Building for Production

```
npm run build
```

### Preview Production Build

```
npm run preview
```

### Lint Code

```
npm run lint
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- EIP-4337 for the Account Abstraction standard
- The Ethereum community for pushing wallet innovation forward
