import React from "react";
import PropTypes from "prop-types";

export const CheckoutSummary = ({ cart, totalAmount }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              <img
                src={item.image_url || "/placeholder-image.png"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

CheckoutSummary.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
      image_url: PropTypes.string,
    })
  ).isRequired,
  totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
