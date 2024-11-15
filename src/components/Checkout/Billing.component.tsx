import React, { useState } from 'react';

const Billing: React.FC = () => {
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails({
      ...billingDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Billing Details:', billingDetails);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={billingDetails.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={billingDetails.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={billingDetails.city}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          name="state"
          value={billingDetails.state}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Zip:</label>
        <input
          type="text"
          name="zip"
          value={billingDetails.zip}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={billingDetails.country}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Billing;
