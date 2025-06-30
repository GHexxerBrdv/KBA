import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

const FundAccount = ({ isConnected, smartAccountAddress, signer }) => {
  const [fundAmount, setFundAmount] = useState(0.01);
  const [status, setStatus] = useState({ message: '', type: '' });

  // Fund smart account (simulated)
  const fundSmartAccount = async () => {
    try {
      if (!smartAccountAddress) {
        throw new Error('Please deploy a smart account first');
      }

      if (!fundAmount || fundAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      setStatus({ message: 'Sending ETH to smart account...', type: 'info' });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus({ message: `Successfully funded account with ${fundAmount} ETH!`, type: 'success' });

    } catch (error) {
      console.error('Funding error:', error);
      setStatus({ message: `Funding failed: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="card">
      <h2>
        <i className="pi pi-dollar mr-2"></i>
        Fund Smart Account
      </h2>
      
      <div className="p-field mb-4">
        <label htmlFor="fundAmount" className="block mb-2">Amount to Fund (ETH)</label>
        <InputNumber 
          id="fundAmount" 
          value={fundAmount} 
          onValueChange={(e) => setFundAmount(e.value)} 
          mode="decimal" 
          minFractionDigits={3} 
          maxFractionDigits={5} 
          className="w-full" 
        />
      </div>
      
      <Button 
        icon="pi pi-money-bill" 
        label="Fund Account" 
        onClick={fundSmartAccount}
        disabled={!isConnected || !smartAccountAddress} 
        className="p-button-warning" 
      />
      
      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}
      
      <div className="warning mt-4">
        ⚠️ Your smart account needs ETH to execute transactions. Fund it before trying to execute any
        operations.
      </div>
    </div>
  );
};

export default FundAccount; 