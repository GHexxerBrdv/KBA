import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ethers } from 'ethers';
import { ProgressSpinner } from 'primereact/progressspinner';

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
  const [isDeploying, setIsDeploying] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [deploymentStep, setDeploymentStep] = useState(0);
  
  // Validate entry point address when it changes
  useEffect(() => {
    if (entryPointAddress) {
      setIsValidAddress(ethers.isAddress(entryPointAddress));
    }
  }, [entryPointAddress]);
  
  // Deploy smart account
  const deploySmartAccount = async () => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      if (!ethers.isAddress(entryPointAddress)) {
        throw new Error('Invalid EntryPoint address');
      }

      setIsDeploying(true);
      setDeploymentStep(1);
      setStatus({ message: 'Deploying smart account...', type: 'info' });

      // In a real implementation, this would use the ethers signer to deploy the account
      // For demonstration, we'll simulate the deployment process

      // Step 1: Create a factory contract instance (simulated here)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Calculate counterfactual address (simulated)
      setDeploymentStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Deploy the smart account
      setDeploymentStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a deterministic address based on the user's address
      // In a real implementation, this would be calculated based on CREATE2 
      const salt = ethers.keccak256(ethers.toUtf8Bytes(new Date().toString()));
      const accountAddressBytes = ethers.concat([
        ethers.getBytes(userAddress),
        ethers.getBytes(salt).slice(0, 20)
      ]);
      const smartAccountAddress = ethers.hexlify(ethers.keccak256(accountAddressBytes).slice(0, 20));

      // Update state with the new account
      setSmartAccountAddress(smartAccountAddress);
      setAccountInfo({
        address: smartAccountAddress,
        owner: userAddress,
        entryPoint: entryPointAddress
      });

      setStatus({ message: 'Smart account deployed successfully!', type: 'success' });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus({ message: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('Deployment error:', error);
      setStatus({ message: `Deployment failed: ${error.message}`, type: 'error' });
    } finally {
      setIsDeploying(false);
      setDeploymentStep(0);
    }
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
        <i className="pi pi-user-plus mr-2"></i>
        Deploy Smart Account
      </h2>
      
      <div className="deploy-container">
        {!accountInfo.address ? (
          <div className="deploy-form">
            <div className="deploy-intro">
              <div className="deploy-icon">
                <i className="pi pi-shield"></i>
              </div>
              <div className="deploy-text">
                <h3>Create Your Smart Account</h3>
                <p>Deploy a smart contract account that you control with your wallet</p>
              </div>
            </div>
            
            <div className="p-field mb-4">
              <label htmlFor="entryPointAddress" className="block mb-2">EntryPoint Contract Address</label>
              <div className="input-with-help">
                <InputText 
                  id="entryPointAddress" 
                  value={entryPointAddress} 
                  onChange={(e) => setEntryPointAddress(e.target.value)} 
                  className={`w-full ${!isValidAddress && entryPointAddress ? 'p-invalid' : ''}`}
                />
                <div className="input-help-text">
                  <i className="pi pi-info-circle"></i>
                  <span>Default EntryPoint from EIP-4337</span>
                </div>
              </div>
              {!isValidAddress && entryPointAddress && (
                <small className="p-error block">Please enter a valid Ethereum address</small>
              )}
            </div>
            
            <Button 
              icon="pi pi-rocket" 
              label={isDeploying ? "Deploying..." : "Deploy Minimal Account"} 
              onClick={deploySmartAccount} 
              disabled={!isConnected || isDeploying || !isValidAddress} 
              loading={isDeploying}
              className="p-button-primary p-button-raised"
            />
          </div>
        ) : (
          <div className="account-details">
            <div className="account-header">
              <div className="account-title">
                <i className="pi pi-check-circle"></i>
                <h3>Smart Account Deployed</h3>
              </div>
              <div className="account-badge">Active</div>
            </div>
            
            <div className="wallet-info">
              <div className="info-row">
                <span className="info-label">Account Address:</span>
                <span className="info-value">
                  {formatAddress(accountInfo.address)}
                  <Button 
                    icon="pi pi-copy" 
                    onClick={() => copyToClipboard(accountInfo.address)}
                    className="p-button-text p-button-rounded p-button-sm" 
                    tooltip="Copy address"
                  />
                </span>
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
          </div>
        )}
      </div>
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      {isDeploying && (
        <div className="deployment-progress">
          <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="4" animationDuration=".5s"/>
          <div className="mt-2">Deploying your smart account...</div>
          <div className="deployment-steps">
            <div className={`step ${deploymentStep >= 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-text">Initializing factory</div>
            </div>
            <div className={`step ${deploymentStep >= 2 ? 'completed' : deploymentStep === 1 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">Calculating address</div>
            </div>
            <div className={`step ${deploymentStep >= 3 ? 'completed' : deploymentStep === 2 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-text">Deploying account</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeployAccount; 