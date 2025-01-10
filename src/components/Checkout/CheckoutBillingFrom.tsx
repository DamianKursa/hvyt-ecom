import React from 'react';
import CreateAccount from '@/components/UI/CreateAccount';

export interface CheckoutBillingFormProps {
  customerType: 'individual' | 'company';
  setCustomerType: React.Dispatch<
    React.SetStateAction<'individual' | 'company'>
  >;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  subscribeNewsletter: boolean;
  setSubscribeNewsletter: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setBillingData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      phone: string;
      company: string;
      vatNumber: string;
    }>
  >;
}

const CheckoutBillingForm: React.FC<CheckoutBillingFormProps> = ({
  customerType,
  setCustomerType,
  email,
  setEmail,
  setPassword,
  subscribeNewsletter,
  setSubscribeNewsletter,
  user,
  setBillingData,
}) => {
  return (
    <div className="p-[24px_16px] border border-beige-dark rounded-[24px] bg-white">
      {/* Customer Type Toggle */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            value="individual"
            checked={customerType === 'individual'}
            onChange={() => {
              setCustomerType('individual');
              setBillingData((prev) => ({
                ...prev,
                company: '',
                vatNumber: '',
              })); // Clear company-specific fields when switching to individual
            }}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border-2 ${
              customerType === 'individual'
                ? 'border-black border-[5px]'
                : 'border-gray-400'
            }`}
          ></span>
          <span className="ml-2">Klient indywidualny</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="company"
            checked={customerType === 'company'}
            onChange={() => setCustomerType('company')}
            className="hidden"
          />
          <span
            className={`w-5 h-5 rounded-full border-2 ${
              customerType === 'company'
                ? 'border-black border-[5px]'
                : 'border-gray-400'
            }`}
          ></span>
          <span className="ml-2">Firma</span>
        </label>
      </div>

      {/* Dynamic Fields */}
      <div className="grid grid-cols-2 gap-4">
        {customerType === 'individual' ? (
          <>
            <input
              type="text"
              placeholder="Imię*"
              onChange={(e) =>
                setBillingData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="Nazwisko*"
              onChange={(e) =>
                setBillingData((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nazwa firmy*"
              onChange={(e) =>
                setBillingData((prev) => ({
                  ...prev,
                  company: e.target.value,
                }))
              }
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
            <input
              type="text"
              placeholder="NIP*"
              onChange={(e) =>
                setBillingData((prev) => ({
                  ...prev,
                  vatNumber: e.target.value,
                }))
              }
              className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adres e-mail*"
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
        <input
          type="text"
          placeholder="Nr telefonu*"
          onChange={(e) =>
            setBillingData((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
          className="w-full border-b border-black p-2 bg-white focus:outline-none placeholder:font-light placeholder:text-black"
        />
      </div>

      {/* Create Account Section */}
      {!user && (
        <>
          <CreateAccount
            onSave={(data) => {
              setPassword(data.password);
            }}
          />
        </>
      )}

      {/* Newsletter Checkbox */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="newsletter"
          checked={subscribeNewsletter}
          onChange={() => setSubscribeNewsletter((prev) => !prev)}
          className="hidden"
        />
        <label
          htmlFor="newsletter"
          className={`flex items-center cursor-pointer w-5 h-5 border border-black rounded ${
            subscribeNewsletter ? 'bg-black' : ''
          }`}
        >
          {subscribeNewsletter && (
            <img
              src="/icons/check.svg"
              alt="check"
              className="w-4 h-4 text-white"
            />
          )}
        </label>
        <span className="text-sm">Zapisz się do newslettera</span>
      </div>
    </div>
  );
};

export default CheckoutBillingForm;
