import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '../components/Input/InputField.component';
import Layout from '../components/Layout/Layout.component';
import SocialIcons from '@/components/UI/SocialIcons';
import Checkbox from '@/components/UI/Checkbox';
import { useState } from 'react';
import Head from 'next/head';
import { useI18n } from '@/utils/hooks/useI18n';

const Kontakt = () => {
  const {t, getPath} = useI18n();
  const methods = useForm();
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState('');

  const onSubmit = async (data: any) => {
    console.log('onSubmit triggered, isTermsChecked:', isTermsChecked);

    if (!isTermsChecked) {
      setTermsError('Musisz zaakceptować Regulamin oraz Politykę Prywatności');
      setSubmitMessage('');
      return;
    } else {
      setTermsError('');
    }

    try {
      console.log('Submitting data:', data);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Form submission failed');
      }

      const result = await res.json();

      setSubmitMessage(t.contact.messageSent);
      setSubmitMessageType('success');
    } catch (error) {
      setSubmitMessage(
        t.contact.messageSendingError,
      );
      setSubmitMessageType('error');
    }
  };

  const onError = (errors: any) => {
    console.log('Validation errors: ', errors);
  };

  return (
    <Layout title={`Hvyt | ${t.contact.title}`}>
      <Head>
        <link
          id="meta-canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}${getPath('/kontakt')}`}
        />
      </Head>
      <section className="container mx-auto mt-[55px] px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-stretch justify-between rounded-[24px] overflow-hidden">
          {/* Left Side (Contact Information) */}
          <div
            className="bg-[#F5F5AD] w-full text-black p-5 md:p-0 max-w-full md:max-w-[500px]"
            style={{ maxWidth: '500px' }}
          >
            <div className="w-full pt-4 mb-[32px]">
              <h1 className="text-[40px] md:text-[65px] md:pl-[48px] text-dark-pastel-red font-bold text-start md:text-left">
                {t.contact.title}
              </h1>
            </div>
            <div className="grid grid-cols-2">
              <div className="w-[250px] md:pl-[48px]">
                <ul className="space-y-[48px] pb-[54px] font-light text-[18px]">
                  <li className="flex items-start">
                    <img
                      src="/icons/mapa.svg"
                      alt="Address Icon"
                      className="mr-4 mt-1 md:w-6 h-6 w-8 h-8 "
                    />
                    <div className="text-left">
                      <span className="block font-bold mb-2">{t.contact.address}</span>
                      <p>Głogoczów 996,</p>
                      <p>32-444 Głogoczów</p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <img
                      src="/icons/mail.svg"
                      alt="Email Icon"
                      className="mr-4 mt-1 w-8 h-8 md:w-6 h-6"
                    />
                    <div className="text-left">
                      <span className="block font-bold mb-2">Email</span>
                      <Link href="mailto:hello@hvyt.pl">hello@hvyt.pl</Link>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <img
                      src="/icons/telefon.svg"
                      alt="Phone Icon"
                      className="mr-4 mt-1 w-8 h-8 md:w-6 h-6"
                    />
                    <div className="text-left">
                      <span className="block font-bold mb-2">{t.form.phone}</span>
                      <Link href="tel:+48513790697">+48 513 790 697</Link>
                    </div>
                  </li>

                  <li>
                    <SocialIcons />
                  </li>
                </ul>
              </div>

              <div className="relative w-[250px] h-full flex hidden md:flex">
                <div
                  className="w-[250px] h-[250px] bg-cover bg-bottom absolute bottom-0"
                  style={{
                    backgroundImage: "url('/images/contact-image.webp')",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Side (Contact Form) */}
          <div className="w-full md:w-8/12 bg-white py-[56px] px-[20px] md:px-0 md:pl-[72px] md:pr-[120px]">
            <h2 className="text-[24px] md:text-[40px] font-bold text-dark-pastel-red mb-6">
              {t.contact.writeToUs}
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
                <InputField
                  inputLabel={t.contact.nameSurname}
                  inputName="name"
                  customValidation={{ required: t.account.messageRequiredField }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel="Email"
                  inputName="email"
                  type="email"
                  customValidation={{ required: t.account.messageRequiredField }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel={t.contact.message}
                  inputName="message"
                  type="textarea"
                  customValidation={{
                    required: t.account.messageRequiredField,
                    minLength: {
                      value: 10,
                      message:
                        t.contact.messageMinLength,
                    },
                  }}
                  errors={methods.formState.errors}
                />

                <Checkbox
                  checked={isTermsChecked}
                  onChange={() => setIsTermsChecked(!isTermsChecked)}
                  label={
                    <span>
                      {`${t.contact.accept} `}
                      <span className="underline">
                        <Link href="#">{t.contact.terms}</Link>
                      </span>{' '}
                      {`${t.contact.and} `}
                      <span className="underline">
                        <Link href="#">{t.contact.privacyPolicy}</Link>
                      </span>
                    </span>
                  }
                />

                {/* Inline error message if terms are not accepted */}
                {termsError && (
                  <div className="mt-2 px-4 py-2 rounded-lg flex items-center bg-red-500 text-white">
                    <span>{termsError}</span>
                  </div>
                )}
                {/* Submission snackbar message */}
                {submitMessage && (
                  <div
                    className={`mt-2 px-4 py-2 rounded-lg flex items-center ${submitMessageType === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                      }`}
                  >
                    <span>{submitMessage}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full md:w-[240px] mt-8 py-3 font-light px-4 bg-black text-neutral-white rounded-full hover:bg-dark-pastel-red transition-all"
                >
                  {t.contact.sendMessage}
                </button>
              </form>
            </FormProvider>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2">
          <div className="grid grid-cols-2 w-[500px]">
            <div></div>
            <div className="min-h-[250px] bg-[#F5F5AD]"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakt;
