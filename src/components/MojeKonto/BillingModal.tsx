import { useI18n } from '@/utils/hooks/useI18n';
import React, { useState } from 'react';

interface BillingData {
  type: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  companyName?: string;
  nip?: string;
  street: string;
  buildingNumber?: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
}

interface BillingModalProps {
  billingData?: BillingData;
  onSave: (data: BillingData) => void;
  onClose: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({
  billingData,
  onSave,
  onClose,
}) => {

  const {t} = useI18n();

  const [formData, setFormData] = useState<BillingData>({
    type: billingData?.type || 'individual',
    firstName: billingData?.firstName || '',
    lastName: billingData?.lastName || '',
    companyName: billingData?.companyName || '',
    nip: billingData?.nip || '',
    street: billingData?.street || '',
    buildingNumber: billingData?.buildingNumber || '',
    apartmentNumber: billingData?.apartmentNumber || '',
    city: billingData?.city || '',
    postalCode: billingData?.postalCode || '',
  });

  const isFormValid =
    formData.street.trim() !== '' &&
    (formData.type === 'individual'
      ? formData.firstName?.trim() !== '' && formData.lastName?.trim() !== ''
      : formData.companyName?.trim() !== '' && formData.nip?.trim() !== '') &&
    formData.buildingNumber?.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.postalCode.trim() !== '';

  const handleSave = () => {
    if (!isFormValid) {
      alert(t.modal.messageFillAllRequiredFields);
      return;
    }
    onSave({
      ...formData,
      buildingNumber: formData.buildingNumber || '',
      apartmentNumber: formData.apartmentNumber || '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div
        className="bg-beige-light mx-4 md:mx-0 rounded-[25px] w-full max-w-[800px] relative"
        style={{ padding: '40px 32px', maxWidth: '650px' }}
      >
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {billingData ? t.account.editBillingData : t.account.addBillingData}
          </h2>
          <button onClick={onClose}>
            <img
              src="/icons/close-button.svg"
              alt="Close"
              className="w-3 h-3"
              style={{ filter: 'invert(0)' }}
            />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* Radio Buttons */}
          <div className="flex space-x-4">
            <div className="w-full flex items-center">
              <input
                type="radio"
                id="individual"
                name="type"
                value="individual"
                checked={formData.type === 'individual'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as 'individual' | 'company',
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    nip: '',
                  }))
                }
                className="hidden"
              />
              <label
                htmlFor="individual"
                className={`flex items-center cursor-pointer`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 ${formData.type === 'individual'
                    ? 'border-black border-[5px]'
                    : 'border-gray-400'
                    }`}
                ></span>
                <span className="ml-2">{t.checkout.personalData.customerTypeIndividual}</span>
              </label>
            </div>
            <div className="w-full flex items-center">
              <input
                type="radio"
                id="company"
                name="type"
                value="company"
                checked={formData.type === 'company'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as 'individual' | 'company',
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    nip: '',
                  }))
                }
                className="hidden"
              />
              <label
                htmlFor="company"
                className={`flex items-center cursor-pointer`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 ${formData.type === 'company'
                    ? 'border-black border-[5px]'
                    : 'border-gray-400'
                    }`}
                ></span>
                <span className="ml-2">{t.checkout.personalData.customerTypeCompany}</span>
              </label>
            </div>
          </div>

          {formData.type === 'individual' ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
                />
                <span
                  className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.firstName ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  {t.form.firstName} <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
                />
                <span
                  className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.lastName ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  {t.form.lastName} <span className="text-red-500">*</span>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
                />
                <span
                  className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.companyName ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  {t.checkout.personalData.customerTypeCompany} <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="nip"
                  value={formData.nip || ''}
                  onChange={handleChange}
                  className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
                />
                <span
                  className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.nip ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  NIP <span className="text-red-500">*</span>
                </span>
              </div>
            </>
          )}

          {/* Address Fields */}
          <div className="relative">
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
            />
            <span
              className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.street ? 'opacity-0' : 'opacity-100'
                }`}
            >
              {t.checkout.shippingAddress.streetName}<span className="text-red-500">*</span>
            </span>
          </div>
          <div className="flex space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                name="buildingNumber"
                value={formData.buildingNumber || ''}
                onChange={handleChange}
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.buildingNumber ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                {t.checkout.shippingAddress.buildingNumber} <span className="text-red-500">*</span>
              </span>
            </div>
            <input
              name="apartmentNumber"
              value={formData.apartmentNumber || ''}
              onChange={handleChange}
              placeholder={t.checkout.shippingAddress.apartmentNumber}
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
            />
          </div>
          <div className="flex space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.city ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                {t.checkout.shippingAddress.city} <span className="text-red-500">*</span>
              </span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full text-left border-b border-black focus:border-black px-2 py-2 bg-beige-light focus:outline-none font-light"
              />
              <span
                className={`absolute left-2 top-2 text-black font-light pointer-events-none transition-all duration-200 ${formData.postalCode ? 'opacity-0' : 'opacity-100'
                  }`}
              >
                {t.checkout.shippingAddress.postalCode} <span className="text-red-500">*</span>
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="w-[100%] md:w-[35%] py-3 font-medium bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t.account.saveInvoiceData}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
