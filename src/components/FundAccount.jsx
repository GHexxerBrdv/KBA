import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { ethers } from 'ethers';

const FundAccount = ({ isConnected, smartAccountAddress, signer }) => {
  const [fundAmount, setFundAmount] = useState(0.01);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  // Fetch account balances when connected or smart account changes
  useEffect(() => {
    if (isConnected && smartAccountAddress && signer) {
      fetchBalances();
    }
  }, [isConnected, smartAccountAddress, signer]);

  // Fetch balances of both user wallet and smart account
  const fetchBalances = async () => {
    try {
      if (!signer || !smartAccountAddress) return;
      
      const provider = signer.provider;
      const userAddress = await signer.getAddress();
      
      // Get user wallet balance
      const walletBalance = await provider.getBalance(userAddress);
      setUserBalance(parseFloat(ethers.formatEther(walletBalance)));
      
      // Get smart account balance
      const accountBalance = await provider.getBalance(smartAccountAddress);
      setBalance(parseFloat(ethers.formatEther(accountBalance)));
      
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  // Fund smart account
  const fundSmartAccount = async () => {
    try {
      if (!smartAccountAddress) {
        throw new Error('Please deploy a smart account first');
      }

      if (!fundAmount || fundAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!signer) {
        throw new Error('No signer available');
      }

      setIsLoading(true);
      setStatus({ message: 'Sending ETH to smart account...', type: 'info' });

      // Convert ETH amount to wei
      const fundAmountWei = ethers.parseEther(fundAmount.toString());
      
      // Check if user has enough balance
      const userAddress = await signer.getAddress();
      const userBalanceWei = await signer.provider.getBalance(userAddress);
      
      if (userBalanceWei < fundAmountWei) {
        throw new Error(`Insufficient funds. Your balance: ${ethers.formatEther(userBalanceWei)} ETH`);
      }
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: smartAccountAddress,
        value: fundAmountWei
      });
      
      setStatus({ message: `Transaction sent! Hash: ${tx.hash.slice(0, 10)}...`, type: 'info' });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Update balances
      await fetchBalances();
      
      setStatus({ message: `Successfully funded account with ${fundAmount} ETH!`, type: 'success' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ message: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('Funding error:', error);
      setStatus({ message: `Funding failed: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-dollar mr-2"></i>
        Fund Smart Account
      </h2>
      
      <div className="fund-container">
        <div className="fund-intro">
          <div className="fund-icon">
            <i className="pi pi-wallet"></i>
          </div>
          <div className="fund-text">
            <h3>Fund Your Smart Account</h3>
            <p>Send ETH to your smart account to use for transactions</p>
          </div>
        </div>
        
        <div className="balances-container">
          {balance !== null && (
            <div className="balance-card">
              <div className="balance-title">Smart Account Balance</div>
              <div className="balance-amount">{balance.toFixed(4)} <span>ETH</span></div>
              <div className="balance-address">{formatAddress(smartAccountAddress)}</div>
            </div>
          )}
          
          {userBalance !== null && (
            <div className="balance-card">
              <div className="balance-title">Your Wallet Balance</div>
              <div className="balance-amount">{userBalance.toFixed(4)} <span>ETH</span></div>
            </div>
          )}
        </div>
        
        <div className="fund-form">
          <div className="p-field mb-4">
            <label htmlFor="fundAmount" className="block mb-2">Amount to Fund (ETH)</label>
            <InputNumber 
              id="fundAmount" 
              value={fundAmount} 
              onValueChange={(e) => setFundAmount(e.value)} 
              mode="decimal" 
              minFractionDigits={3} 
              maxFractionDigits={5}
              min={0.001}
              max={userBalance || 100}
              className="w-full" 
            />
          </div>
          
          <Button 
            icon="pi pi-send" 
            label={isLoading ? "Sending ETH..." : "Fund Account"} 
            onClick={fundSmartAccount}
            disabled={!isConnected || !smartAccountAddress || isLoading || !fundAmount || fundAmount <= 0 || (userBalance !== null && fundAmount > userBalance)} 
            loading={isLoading}
            className="p-button-warning p-button-raised" 
          />
        </div>
      </div>
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      {!isLoading && !smartAccountAddress && (
        <div className="warning mt-4">
          ⚠️ You need to deploy a smart account first before funding it.
        </div>
      )}
      
      {!isLoading && smartAccountAddress && (
        <div className="warning mt-4">
          ⚠️ Your smart account needs ETH to execute transactions. Fund it before trying to execute any
          operations.
        </div>
      )}
    </div>
  );
};

export default FundAccount; 