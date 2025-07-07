import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon-wrapper">
          <span className="logo-icon">⚡</span>
        </div>
        <span className="logo-text">KBA</span>
      </div>
      <h1>Smart Account Platform</h1>
      <p className="tagline">Create and manage EIP-4337 Account Abstraction wallets with ease</p>
      
      <div className="feature-pills">
        <span className="pill">Deploy</span>
        <span className="connector">•</span>
        <span className="pill">Fund</span>
        <span className="connector">•</span>
        <span className="pill">Execute</span>
        <span className="connector">•</span>
        <span className="pill">Interact</span>
      </div>
      
      <div className="info-banner">
        <div className="info-icon">ℹ️</div>
        <div className="info-text">
          Account Abstraction enables powerful smart contract functionality for your wallet,
          including batched transactions, gas sponsoring, and programmable security features.
        </div>
      </div>
    </div>
  );
};

export default Header; 