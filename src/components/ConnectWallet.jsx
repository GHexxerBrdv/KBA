import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { ethers } from 'ethers';

const ConnectWallet = ({ 
  connectionStatus, 
  updateConnectionStatus, 
  setProvider, 
  setSigner, 
  setUserAddress, 
  setWalletInfo, 
  walletInfo 
}) => {
  const [status, setStatus] = useState({ message: '', type: '' });

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet(false);
        }
      } catch (error) {
        console.log('No wallet connected');
      }
    }
  };

  // Connect to MetaMask wallet
  const connectWallet = async (showStatus = true) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      if (showStatus) {
        setStatus({ message: 'Connecting to MetaMask...', type: 'info' });
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Initialize ethers provider and signer
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const ethSigner = await ethProvider.getSigner();
      const address = await ethSigner.getAddress();

      // Get network info
      const network = await ethProvider.getNetwork();
      const balance = await ethProvider.getBalance(address);
      const balanceEth = ethers.formatEther(balance);

      // Update state
      setProvider(ethProvider);
      setSigner(ethSigner);
      setUserAddress(address);
      setWalletInfo({
        address: address,
        network: `${network.name} (${network.chainId})`,
        balance: parseFloat(balanceEth).toFixed(4)
      });

      updateConnectionStatus(true);

      if (showStatus) {
        setStatus({ message: 'Successfully connected to MetaMask!', type: 'success' });
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
      console.error('Connection error:', error);
      setStatus({ message: `Connection failed: ${error.message}`, type: 'error' });
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== walletInfo.address) {
      window.location.reload(); // Reload page on account change
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    window.location.reload(); // Reload page on chain change
  };

  // Disconnect wallet (mostly for UI purposes as MetaMask doesn't have a disconnect method)
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress(null);
    setWalletInfo({
      address: '',
      network: '',
      balance: ''
    });
    updateConnectionStatus(false);
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-wallet mr-2"></i>
        Wallet Connection
      </h2>
      
      {connectionStatus && walletInfo.address && (
        <div className="wallet-info">
          <h3>🔗 Connected Wallet</h3>
          <div className="info-row">
            <span className="info-label">Address:</span>
            <span className="info-value">{formatAddress(walletInfo.address)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Network:</span>
            <span className="info-value">{walletInfo.network}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Balance:</span>
            <span className="info-value">{walletInfo.balance} ETH</span>
          </div>
        </div>
      )}
      
      <Button 
        icon={connectionStatus ? "pi pi-check" : "pi pi-link"} 
        label={connectionStatus ? "Connected" : "Connect MetaMask"} 
        onClick={connectWallet} 
        className={connectionStatus ? "p-button-success" : "p-button-primary"} 
      />
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      <div className="feature-highlight">
        <h4>🚀 Getting Started</h4>
        <p>Connect your MetaMask wallet to begin creating and managing smart contract accounts. Make sure
          you're on a supported network with some ETH for gas fees.</p>
      </div>
    </div>
  );
};

export default ConnectWallet; 