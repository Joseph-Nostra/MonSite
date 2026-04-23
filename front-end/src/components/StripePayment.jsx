import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../axios";
import LoadingSpinner from "./Common/LoadingSpinner";

const StripePayment = ({ clientSecret, orderId, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      onPaymentError(result.error.message);
      setLoading(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        onPaymentSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-3 py-4 bg-white rounded shadow-sm">
      <div className="mb-4">
        <label className="form-label fw-bold small text-muted text-uppercase">Informations de carte</label>
        <div className="p-3 border rounded-3 bg-light">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} />
        </div>
      </div>
      <button 
        type="submit" 
        className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
        disabled={!stripe || loading}
      >
        {loading ? (
          <LoadingSpinner size="sm" color="white" />
        ) : (
          <>
            <i className="bi bi-shield-check me-2"></i>
            Payer Sécurisé
          </>
        )}
      </button>
    </form>
  );
};

export default StripePayment;
