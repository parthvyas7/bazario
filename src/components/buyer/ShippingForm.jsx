import React from "react";

export const ShippingForm = ({ shippingInfo, setShippingInfo, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={shippingInfo.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={shippingInfo.country}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </form>
  );
};

import PropTypes from "prop-types";

ShippingForm.propTypes = {
  shippingInfo: PropTypes.shape({
    fullName: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  setShippingInfo: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
