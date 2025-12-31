import React from "react";

export const PaymentForm = ({
  paymentInfo,
  setPaymentInfo,
  onNext,
  onPrevious,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-sm text-yellow-700">
          This is a demo application. Do not enter real credit card information.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handleChange}
            required
            maxLength="16"
            placeholder="0000 0000 0000 0000"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardHolder"
            value={paymentInfo.cardHolder}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChange={handleChange}
              required
              placeholder="MM/YY"
              maxLength="5"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handleChange}
              required
              maxLength="3"
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Review Order
          </button>
        </div>
      </div>
    </form>
  );
};

import PropTypes from "prop-types";

PaymentForm.propTypes = {
  paymentInfo: PropTypes.shape({
    cardNumber: PropTypes.string,
    cardHolder: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
  }).isRequired,
  setPaymentInfo: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};
