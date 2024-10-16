import Image from 'next/image';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '../components/Input/InputField.component';
import Layout from '../components/Layout/Layout.component'; // Assuming Layout is at this path
import SocialIcons from '@/components/UI/SocialIcons';
const Kontakt = () => {
  const methods = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Layout title="Kontakt">
      <section className="container mx-auto max-w-grid-desktop px-grid-desktop-margin pb-[88px] py-16">
        <div className="flex flex-col md:flex-row justify-between rounded-lg overflow-hidden">
          {/* Left Side (Contact Information) */}
          <div className="bg-[#F5F5AD] w-full md:w-4/12 p-8 text-black">
            <h1 className="text-4xl font-bold mb-6">Kontakt</h1>

            <ul className="space-y-6 text-lg">
              {/* Address */}
              <li className="flex items-start">
                <img src="/icons/mapa.svg" alt="Address Icon" className="mr-4 mt-1 w-6 h-6" />
                <div className="text-left">
                  <span className="block font-bold">Adres</span>
                  Głogoczów 996,<br />
                  32-444 Głogoczów
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start">
                <img src="/icons/mail.svg" alt="Email Icon" className="mr-4 mt-1 w-6 h-6" />
                <div className="text-left">
                  <span className="block font-bold">Email</span>
                  <Link href="mailto:hello@hvyt.pl">hello@hvyt.pl</Link>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start">
                <img src="/icons/telefon.svg" alt="Phone Icon" className="mr-4 mt-1 w-6 h-6" />
                <div className="text-left">
                  <span className="block font-bold">Telefon</span>
                  <Link href="tel:+48513790697">+48 513 790 697</Link>
                </div>
              </li>
            </ul>

            {/* Social Icons */}
            <SocialIcons/>

            {/* Image (Contact Visual) */}
            <div className="mt-8">
              <Image
                src="/images/contact-image.png"
                alt="Kontakt Image"
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Right Side (Contact Form) */}
          <div className="w-full md:w-8/12 bg-white p-8">
            <h2 className="text-4xl font-bold text-dark-pastel-red mb-6">Napisz do nas</h2>

            {/* Form with react-hook-form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {/* Input fields */}
                <InputField
                  inputLabel="Imię i nazwisko"
                  inputName="name"
                  customValidation={{ required: "To pole jest wymagane" }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel="Email"
                  inputName="email"
                  type="email"
                  customValidation={{ required: "To pole jest wymagane" }}
                  errors={methods.formState.errors}
                />
                <InputField
                  inputLabel="Treść wiadomości"
                  inputName="message"
                  type="textarea"
                  customValidation={{ required: "To pole jest wymagane", minLength: 10 }}
                  errors={methods.formState.errors}
                />

                {/* Checkbox for accepting terms */}
                <div className="flex items-start mt-4">
                  <input type="checkbox" id="acceptTerms" className="mr-2 mt-1" />
                  <label htmlFor="acceptTerms" className="text-sm text-neutral-dark">
                    Akceptuję <span className="underline"><Link href="#">Regulamin</Link></span> oraz <span className="underline"><Link href="#">Politykę Prywatności</Link></span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-6 py-3 px-4 bg-black text-neutral-white rounded-full hover:bg-dark-pastel-red transition-all"
                >
                  Wyślij wiadomość
                </button>
              </form>
            </FormProvider>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kontakt;
