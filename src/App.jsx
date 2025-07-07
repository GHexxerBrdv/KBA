import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Header from './components/Header'
import ConnectWallet from './components/ConnectWallet'
import DeployAccount from './components/DeployAccount'
import FundAccount from './components/FundAccount'
import SimpleTransaction from './components/SimpleTransaction'
import ContractInteraction from './components/ContractInteraction'

// PrimeReact imports
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './App.css'

function App() {
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [userAddress, setUserAddress] = useState(null)
  const [walletInfo, setWalletInfo] = useState({
    address: '',
    network: '',
    balance: ''
  })
  const [smartAccountAddress, setSmartAccountAddress] = useState(null)
  const [accountInfo, setAccountInfo] = useState({
    address: '',
    owner: '',
    entryPoint: ''
  })

  const updateConnectionStatus = (status) => {
    setConnectionStatus(status)
  }

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window.ethereum === 'undefined') {
        console.warn('MetaMask is not installed!')
      }
    }
    
    checkMetaMask()
  }, [])

  return (
    <PrimeReactProvider>
      <div className="app-container">
        <div className={`connection-status ${connectionStatus ? 'connected' : 'disconnected'}`}>
          {connectionStatus ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        
        <div className="container">
          <Header />
          
          <div className="main-content">
            <ConnectWallet 
              connectionStatus={connectionStatus} 
              updateConnectionStatus={updateConnectionStatus}
              setProvider={setProvider}
              setSigner={setSigner}
              setUserAddress={setUserAddress}
              setWalletInfo={setWalletInfo}
              walletInfo={walletInfo}
            />
            
            <DeployAccount 
              isConnected={connectionStatus}
              userAddress={userAddress}
              signer={signer}
              setSmartAccountAddress={setSmartAccountAddress}
              setAccountInfo={setAccountInfo}
              accountInfo={accountInfo}
            />
            
            <FundAccount 
              isConnected={connectionStatus}
              smartAccountAddress={smartAccountAddress}
              signer={signer}
            />
            
            <SimpleTransaction 
              isConnected={connectionStatus}
              smartAccountAddress={smartAccountAddress}
              signer={signer}
            />
            
            <ContractInteraction 
              isConnected={connectionStatus}
              smartAccountAddress={smartAccountAddress}
              signer={signer}
            />
          </div>
        </div>
      </div>
    </PrimeReactProvider>
  )
}

export default App
