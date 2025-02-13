import Image from 'next/image';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '../components/Input/InputField.component';
import Layout from '../components/Layout/Layout.component'; // Assuming Layout is at this path
import SocialIcons from '@/components/UI/SocialIcons';
import Checkbox from '@/components/UI/Checkbox';
import { useState } from 'react';

const Kontakt = () => {
  const methods = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  return (
    <Layout title="Hvyt | Kontakt">
      <section className="container">
        {/* First Row */}
        <div className="flex flex-col md:flex-row justify-between rounded-[24px] overflow-hidden">
          {/* Left Side (Contact Information) */}
          <div
            className="bg-[#F5F5AD] w-full text-black"
            style={{ maxWidth: '500px' }}
          >
            {/* Title Row */}
            <div className="w-full pt-4 mb-[32px]">
              <h1 className="text-[65px] pl-[48px] text-dark-pastel-red font-bold text-center md:text-left">
                Kontakt
              </h1>
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-2">
              {/* Left Column (UL Content) */}
              <div className="w-[250px] pl-[48px]">
                <ul className="space-y-[48px] pb-[54px] font-light text-[18px]">
                  <li className="flex items-start">
                    <img
                      src="/icons/mapa.svg"
                      alt="Address Icon"
                      className="mr-4 mt-1 w-6 h-6"
                    />
                    <div className="text-left">
                      <span className="block font-bold mb-2">Adres</span>
                      <p>Głogoczów 996,</p>
                      <p>32-444 Głogoczów</p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <img
                      src="/icons/mail.svg"
                      alt="Email Icon"
                      className="mr-4 mt-1 w-6 h-6"
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
                      className="mr-4 mt-1 w-6 h-6"
                    />
                    <div className="text-left">
                      <span className="block font-bold mb-2">Telefon</span>
                      <Link href="tel:+48513790697">+48 513 790 697</Link>
                    </div>
                  </li>

                  <li>
                    <SocialIcons />
                  </li>
                </ul>
              </div>

              {/* Right Column (Image) */}
              <div className="relative w-[250px] h-full flex">
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
          <div className="w-full md:w-8/12 bg-white py-[56px] md:pl-[72px] md:pr-[120px]">
            <h2 className="text-[40px] font-bold text-dark-pastel-red mb-6">
              Napisz do nas
            </h2>

            {/* Form with react-hook-form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {/* Input fields */}
                <InputField
                  inputLabel="Imię i nazwisko"
                  inputName="name"
                  customValidation={{ required: 'To pole jest wymagane' }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel="Email"
                  inputName="email"
                  type="email"
                  customValidation={{ required: 'To pole jest wymagane' }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel="Treść wiadomości"
                  inputName="message"
                  type="textarea"
                  customValidation={{
                    required: 'To pole jest wymagane',
                    minLength: 10,
                  }}
                  errors={methods.formState.errors}
                />

                <Checkbox
                  checked={isTermsChecked}
                  onChange={() => setIsTermsChecked(!isTermsChecked)}
                  label={
                    <span>
                      Akceptuję{' '}
                      <span className="underline">
                        <Link href="#">Regulamin</Link>
                      </span>{' '}
                      oraz{' '}
                      <span className="underline">
                        <Link href="#">Politykę Prywatności</Link>
                      </span>
                    </span>
                  }
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-[240px] mt-8 py-3 font-light px-4 bg-black text-neutral-white rounded-full hover:bg-dark-pastel-red transition-all"
                >
                  Wyślij wiadomość
                </button>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column with Two Sub-Columns */}
          <div className="grid grid-cols-2 w-[500px]">
            {/* Left Sub-Column */}
            <div></div>

            {/* Right Sub-Column */}
            <div className="min-h-[250px] bg-[#F5F5AD]"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakt;
