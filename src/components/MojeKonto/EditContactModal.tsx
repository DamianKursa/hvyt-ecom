import { useI18n } from '@/utils/hooks/useI18n';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface EditContactModalProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onUpdate: (updatedUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
      phone: user.phone || '',
    },
  });

  const {t} = useI18n();

  useEffect(() => {
    methods.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });
  }, [user, methods]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: { firstName: string; lastName: string; email: string; phone: string }) => {
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
      className="fixed inset-0  flex items-center justify-center"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div
        className="mx-4 md:mx-0 bg-beige-light rounded-[25px] w-full max-w-[800px] relative"
        style={{ padding: '40px 32px', maxWidth: '650px' }}
      >
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t.account.editContactData}</h2>
          <button onClick={onClose}>
            <img
              src="/icons/close-button.svg"
              alt="Close"
              className="w-3 h-3"
              style={{ filter: 'invert(0)' }}
            />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1 pl-2">
                  {t.form.firstName}
                </label>
                <input
                  {...methods.register('firstName', {
                    required: t.account.messageRequiredField,
                  })}
                  type="text"
                  placeholder={t.form.firstName}
                  className="w-full border-b border-black p-2 bg-beige-light focus:outline-none"
                />
                {methods.formState.errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1 pl-2">
                  {t.form.lastName} 
                </label>
                <input
                  {...methods.register('lastName', {
                    required: t.account.messageRequiredField,
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
                <label className="block text-sm font-medium text-black mb-1 pl-2">
                  Email
                </label>
                <input
                  {...methods.register('email', {
                    required: t.account.messageRequiredField,
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
              <div>
                <label className="block text-sm font-medium text-black mb-1 pl-2">
                  {t.form.phone} 
                </label>
                <input
                  {...methods.register('phone', {
                    required: t.account.messageRequiredField,
                    pattern: {
                      value: /^\+?[0-9\s-]{7,15}$/,
                      message: t.account.messageEnterPhone,
                    },
                  })}
                  type="tel"
                  inputMode="tel"
                  placeholder={t.form.phone} 
                  className="w-full border-b border-black p-2 bg-beige-light focus:outline-none"
                />
                {methods.formState.errors.phone && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.phone.message as string}
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
                {loading ? t.auth.saving : t.auth.saveChanges}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EditContactModal;
