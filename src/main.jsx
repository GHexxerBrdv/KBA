import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import PrimeReact styles
import 'primereact/resources/themes/lara-dark-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Import custom styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
