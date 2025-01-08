import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface EditContactModalProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  onUpdate: (updatedUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<void>;
  onClose: () => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  user,
  onUpdate,
  onClose,
}) => {
  const methods = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onUpdate({ ...user, ...data });
      onClose();
    } catch (err) {
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }} // Overlay color
    >
      <div
        className="bg-beige-light rounded-[25px] w-full max-w-[800px] relative"
        style={{ padding: '40px 32px', maxWidth: '650px' }} // Modal padding
      >
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edytuj Dane Kontaktowe</h2>
          <button onClick={onClose}>
            <img
              src="/icons/close-button.svg"
              alt="Close"
              className="w-3 h-3" // 12px x 12px
              style={{ filter: 'invert(0)' }} // Black color
            />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Imię
                </label>
                <input
                  {...methods.register('firstName', {
                    required: 'To pole jest wymagane',
                  })}
                  type="text"
                  placeholder="Imię"
                  className="w-full border-b border-black p-2 bg-beige-light focus:outline-none"
                />
                {methods.formState.errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nazwisko
                </label>
                <input
                  {...methods.register('lastName', {
                    required: 'To pole jest wymagane',
                  })}
                  type="text"
                  placeholder="Nazwisko"
                  className="w-full border-b border-black p-2 bg-beige-light focus:outline-none"
                />
                {methods.formState.errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email
                </label>
                <input
                  {...methods.register('email', {
                    required: 'To pole jest wymagane',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Podaj poprawny adres email',
                    },
                  })}
                  type="email"
                  placeholder="Email"
                  className="w-full border-b border-black p-2 bg-beige-light focus:outline-none"
                />
                {methods.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="w-[100%] md:w-[25%] py-3  font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all"
                disabled={loading}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditContactModal;
