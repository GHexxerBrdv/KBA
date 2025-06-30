import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ethers } from 'ethers';

const DeployAccount = ({ 
  isConnected, 
  userAddress, 
  signer, 
  setSmartAccountAddress, 
  setAccountInfo, 
  accountInfo 
}) => {
  const [entryPointAddress, setEntryPointAddress] = useState('0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789');
  const [status, setStatus] = useState({ message: '', type: '' });
  
  // Deploy smart account (simulated)
  const deploySmartAccount = async () => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      setStatus({ message: 'Deploying smart account...', type: 'info' });

      if (!ethers.isAddress(entryPointAddress)) {
        throw new Error('Invalid EntryPoint address');
      }

      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a random address for simulation
      const smartAccountAddress = ethers.Wallet.createRandom().address;

      // Update state
      setSmartAccountAddress(smartAccountAddress);
      setAccountInfo({
        address: smartAccountAddress,
        owner: userAddress,
        entryPoint: entryPointAddress
      });

      setStatus({ message: 'Smart account deployed successfully!', type: 'success' });

    } catch (error) {
      console.error('Deployment error:', error);
      setStatus({ message: `Deployment failed: ${error.message}`, type: 'error' });
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-user-plus mr-2"></i>
        Deploy Smart Account
      </h2>
      
      <div className="p-field mb-4">
        <label htmlFor="entryPointAddress" className="block mb-2">EntryPoint Contract Address</label>
        <InputText 
          id="entryPointAddress" 
          value={entryPointAddress} 
          onChange={(e) => setEntryPointAddress(e.target.value)} 
          className="w-full" 
        />
      </div>
      
      <Button 
        icon="pi pi-rocket" 
        label="Deploy Minimal Account" 
        onClick={deploySmartAccount} 
        disabled={!isConnected} 
      />
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      {accountInfo.address && (
        <div id="accountInfo" className="wallet-info mt-4">
          <h3>✅ Your Smart Account</h3>
          <div className="info-row">
            <span className="info-label">Account Address:</span>
            <span className="info-value">{formatAddress(accountInfo.address)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Owner:</span>
            <span className="info-value">{formatAddress(accountInfo.owner)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">EntryPoint:</span>
            <span className="info-value">{formatAddress(accountInfo.entryPoint)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployAccount; 