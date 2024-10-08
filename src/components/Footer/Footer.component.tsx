import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '../Input/InputField.component'; 
import SocialIcons from '../UI/SocialIcons';

const Footer = () => {
  const methods = useForm({
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit = (data: any) => {
    console.log('Newsletter form data:', data);
  };

  return (
    <footer className="bg-beige py-16 text-sm text-neutral-darkest">
      <div className="container mx-auto max-w-grid-desktop px-grid-mobile-margin md:px-grid-desktop-margin">

        {/* First Row - Grid with 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-beige-dark pb-8 mb-8">
          <div className="space-y-4">
            {/* Logo */}
            <img src="/icons/Logo.svg" alt="HVYT Logo" className="h-10" />
            {/* Social Media Icons */}
            <SocialIcons />
          </div>

          {/* Service Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/icons/delivery.svg', title: 'Darmowa dostawa', desc: 'Dla zamówień powyżej 300 zł' },
              { src: '/icons/clock.svg', title: 'Wysyłka w 24h', desc: 'W dni robocze' },
              { src: '/icons/return.svg', title: '30 dni na zwrot', desc: 'Od dnia otrzymania przesyłki' },
              { src: '/icons/lightning.svg', title: 'Błyskawiczne wsparcie', desc: 'Przez formularz i social media' },
            ].map((item, index) => (
              <div key={index} className="text-center lg:text-left">
                <img src={item.src} alt={item.title} className="h-6 mb-2" />
                <span className="block font-semibold font-size-text-small">{item.title}</span>
                <span className="block text-black font-light text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Grid with 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h4 className="text-lg font-semibold">Dane firmowe:</h4>
              <p className="text-regular font-light">HVYT by Marta Wontorczyk</p>
              <p className="text-regular font-light">NIP: 6762570584</p>
              <p className="text-regular font-light">REGON: 384282914</p>
              <h4 className="text-lg font-semibold mt-[24px]">Kontakt</h4>
              <p className="text-regular font-light">hello@hvyt.pl</p>
            </div>

            {/* First Link Column */}
            <div>
              <ul className="space-y-2">
                {['Uchwyty', 'Klamki', 'Wieszaki', 'Hvyt Objects', 'Kolekcje'].map((link, index) => (
                  <li key={index}>
                    <Link href={`/${link.toLowerCase()}`} className="underline text-regular font-light">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Second Link Column */}
            <div>
              <ul className="space-y-2">
                {['O nas', 'Kontakt', 'Współpraca', 'Dostawa', 'Zwroty i reklamacje'].map((link, index) => (
                  <li key={index}>
                    <Link href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="underline text-regular font-light">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-beige-light rounded-xl p-[24px]">
            <h4 className="text-regular font-semibold mb-4">
              Zapisz się do newslettera, aby być na bieżąco z nowościami i promocjami.
            </h4>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
                <div className="flex-grow">
                  <InputField
                    inputLabel="Podaj swój adres e-mail"
                    inputName="email"
                    customValidation={{ required: true }}
                    errors={errors}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-4 px-6 py-3 bg-black text-neutral-white rounded-full font-light hover:bg-neutral-dark transition-all"
                >
                  Zapisz się
                </button>
              </form>
              <p className="text-neutral-darkest text-extra-small font-light">
                Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i na otrzymywanie aktualizacji od naszej firmy.
              </p>
            </FormProvider>
          </div>
        </div>

        {/* Partners Section */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 py-[32px] border-t border-beige-dark">
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-lg font-semibold mb-4">Nasi partnerzy:</h4>
            <div className="flex items-center space-x-4">
              <Link href="#">
                <img src="/icons/inpost.svg" alt="InPost Logo" className="h-9" />
              </Link>
              <Link href="#">
                <img src="/icons/GLS_Logo_2021.svg" alt="GLS Logo" className="h-6" />
              </Link>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-6">
            <h4 className="text-lg font-semibold mb-4">Metody płatności:</h4>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              {['blik', 'przelewy', 'visa', 'mastercard'].map((payment, index) => (
                <Link href="#" key={index}>
                  <img src={`/icons/${payment}.svg`} alt={payment.toUpperCase()} className="h-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="py-[32px] flex justify-between border-t border-beige-dark">
          <p className="text-neutral-darkest font-light">&copy; HvyT. Wszystkie prawa zastrzeżone.</p>
          <div className="text-neutral text-sm">
            <Link href="/regulamin" className="underline mx-2">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="underline mx-2">Polityka prywatności</Link>
            <Link href="/ustawienia-plikow-cookie" className="underline mx-2">Ustawienia plików Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
