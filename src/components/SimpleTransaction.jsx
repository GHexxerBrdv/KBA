import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ethers } from 'ethers';

const SimpleTransaction = ({ isConnected, smartAccountAddress, signer }) => {
  const [destAddress, setDestAddress] = useState('');
  const [ethValue, setEthValue] = useState(0.001);
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  // Validate form when inputs change
  useEffect(() => {
    const valid = ethers.isAddress(destAddress) && ethValue && ethValue > 0;
    setIsValid(valid);
  }, [destAddress, ethValue]);

  // Execute simple transaction (simulated)
  const executeSimpleTransaction = async () => {
    try {
      if (!smartAccountAddress) {
        throw new Error('Please deploy a smart account first');
      }

      if (!ethers.isAddress(destAddress)) {
        throw new Error('Invalid destination address');
      }

      if (!ethValue || ethValue <= 0) {
        throw new Error('Please enter a valid ETH amount');
      }

      setStatus({ message: 'Executing transaction...', type: 'info' });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus({ 
        message: `Successfully sent ${ethValue} ETH to ${formatAddress(destAddress)}!`, 
        type: 'success' 
      });

    } catch (error) {
      console.error('Transaction error:', error);
      setStatus({ message: `Transaction failed: ${error.message}`, type: 'error' });
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-send mr-2"></i>
        Simple Transaction
      </h2>
      
      <div className="p-field mb-4">
        <label htmlFor="destAddress" className="block mb-2">Destination Address</label>
        <InputText 
          id="destAddress" 
          value={destAddress} 
          onChange={(e) => setDestAddress(e.target.value)} 
          className="w-full" 
          placeholder="0x..." 
        />
      </div>
      
      <div className="p-field mb-4">
        <label htmlFor="ethValue" className="block mb-2">ETH Amount</label>
        <InputNumber 
          id="ethValue" 
          value={ethValue} 
          onValueChange={(e) => setEthValue(e.value)} 
          mode="decimal" 
          minFractionDigits={3} 
          maxFractionDigits={5} 
          className="w-full" 
        />
      </div>
      
      <Button 
        icon="pi pi-send" 
        label="Send ETH" 
        onClick={executeSimpleTransaction} 
        disabled={!isConnected || !smartAccountAddress || !isValid} 
      />
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default SimpleTransaction; 