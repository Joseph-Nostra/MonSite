import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import './i18n';

import App from './App.jsx'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// À remplacer par les vraies clés en prod
const stripePromise = loadStripe('pk_test_51O7...placeholder');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </PayPalScriptProvider>
  </StrictMode>,
)
