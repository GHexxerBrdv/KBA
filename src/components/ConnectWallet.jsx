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
  const [isLoading, setIsLoading] = useState(false);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
    
    // Set up event listeners for wallet changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', disconnectWallet);
    }
    
    // Clean up event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', disconnectWallet);
      }
    };
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

      setIsLoading(true);
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
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus({ message: '', type: '' });
        }, 3000);
      }

    } catch (error) {
      console.error('Connection error:', error);
      setStatus({ message: `Connection failed: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      setStatus({ message: 'Wallet disconnected', type: 'info' });
    } else if (accounts[0] !== walletInfo.address) {
      // Account changed - reconnect with the new account
      connectWallet(true);
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    // Reload page on chain change
    window.location.reload();
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
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus({ message: 'Address copied to clipboard!', type: 'success' });
    setTimeout(() => setStatus({ message: '', type: '' }), 2000);
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-wallet mr-2"></i>
        Wallet Connection
      </h2>
      
      <div className="wallet-connection-container">
        {!connectionStatus ? (
          <div className="connect-prompt">
            <div className="connect-icon">
              <i className="pi pi-link"></i>
            </div>
            <h3>Connect Your Wallet</h3>
            <p>Connect your MetaMask wallet to get started with smart account management</p>
            <Button 
              icon="pi pi-link" 
              label={isLoading ? "Connecting..." : "Connect MetaMask"} 
              onClick={connectWallet} 
              loading={isLoading}
              disabled={isLoading}
              className="p-button-primary p-button-raised" 
            />
          </div>
        ) : (
          <div className="wallet-details">
            <div className="wallet-header">
              <div className="wallet-title">
                <i className="pi pi-check-circle"></i>
                <h3>Connected Wallet</h3>
              </div>
              <div className="wallet-badge">Active</div>
            </div>
            
            <div className="wallet-info">
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">
                  {formatAddress(walletInfo.address)}
                  <Button 
                    icon="pi pi-copy" 
                    onClick={() => copyToClipboard(walletInfo.address)}
                    className="p-button-text p-button-rounded p-button-sm" 
                    tooltip="Copy address"
                  />
                </span>
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
          </div>
        )}
      </div>
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      {!connectionStatus && (
        <div className="feature-highlight">
          <h4><i className="pi pi-info-circle"></i> Getting Started</h4>
          <p>Connect your MetaMask wallet to begin creating and managing smart contract accounts. Make sure
            you're on a supported network with some ETH for gas fees.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet; 