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
    <footer className="bg-beige py-8 md:py-16 text-sm text-neutral-darkest">
      <div className="container mx-auto max-w-grid-desktop px-4 sm:px-6 md:px-grid-desktop-margin">

        {/* First Row - Single Row with Space Between */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 border-b border-beige-dark pb-4 md:pb-8 mb-4 md:mb-8">
          <div className="flex justify-between md:block space-y-4">
            {/* Logo */}
            <img src="/icons/Logo.svg" alt="HVYT Logo" className="h-10" />
            {/* Social Media Icons */}
            <SocialIcons />
          </div>

          {/* Service Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { src: '/icons/delivery.svg', title: 'Darmowa dostawa', desc: 'Dla zamówień powyżej 300 zł' },
              { src: '/icons/clock.svg', title: 'Wysyłka w 24h', desc: 'W dni robocze' },
              { src: '/icons/return.svg', title: '30 dni na zwrot', desc: 'Od dnia otrzymania przesyłki' },
              { src: '/icons/lightning.svg', title: 'Błyskawiczne wsparcie', desc: 'Przez formularz i social media' },
            ].map((item, index) => (
              <div key={index} className="text-left">
                <img src={item.src} alt={item.title} className="h-6 mb-2" />
                <span className="block font-semibold text-sm">{item.title}</span>
                <span className="block text-black font-light text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Company Info, Menu Links, and Newsletter in One Row on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
          {/* Company Info and Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-semibold">Dane firmowe:</h4>
              <p className="text-sm font-light">HVYT by Marta Wontorczyk</p>
              <p className="text-sm font-light">NIP: 6762570584</p>
              <p className="text-sm font-light">REGON: 384282914</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Kontakt</h4>
              <p className="text-sm font-light">hello@hvyt.pl</p>
            </div>
          </div>

          {/* Menu Links */}
          <div className="grid grid-cols-2 gap-4">
            <ul className="space-y-2">
              {['O nas', 'Uchwyty', 'Klamki', 'Wieszaki', 'Kolekcje'].map((link, index) => (
                <li key={index}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="underline text-sm font-light">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {['Kontakt', 'Współpraca', 'Dostawa', 'Zwroty i reklamacje'].map((link, index) => (
                <li key={index}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="underline text-sm font-light">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="bg-beige-light rounded-xl p-4 md:p-6">
            <h4 className="text-sm font-semibold mb-4 text-left">
              Zapisz się do newslettera, aby być na bieżąco z nowościami i promocjami.
            </h4>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-center">
                <div className="flex-grow w-full mb-2 md:mb-0">
                  <InputField
                    inputLabel="Podaj swój adres e-mail"
                    inputName="email"
                    customValidation={{ required: true }}
                    errors={errors}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-4 py-2 bg-black text-neutral-white rounded-full font-light hover:bg-neutral-dark transition-all"
                >
                  Zapisz się
                </button>
              </form>
              <p className="text-neutral-darkest text-xs font-light mt-2 text-left">
                Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i na otrzymywanie aktualizacji od naszej firmy.
              </p>
            </FormProvider>
          </div>
        </div>

        {/* Partners Section - Left Aligned */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 py-4 md:py-8 border-t border-beige-dark">
          <div className="col-span-2 md:col-span-3 text-left">
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
          <div className="col-span-2 md:col-span-6 text-left">
            <h4 className="text-lg font-semibold mb-4">Metody płatności:</h4>
            <div className="flex items-center space-x-4">
              {['blik', 'przelewy', 'visa', 'mastercard'].map((payment, index) => (
                <Link href="#" key={index}>
                  <img src={`/icons/${payment}.svg`} alt={payment.toUpperCase()} className="h-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Section - Single Column, Left Aligned */}
        <div className="py-4 md:py-8 flex flex-col items-start border-t border-beige-dark">
          <p className="text-black text-xs md:text-sm font-light mb-2">&copy; HvyT. Wszystkie prawa zastrzeżone.</p>
          <div className="text-black text-xs md:text-sm flex flex-col md:flex-row md:space-x-2">
            <Link href="/regulamin" className="font-light">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="font-light">Polityka prywatności</Link>
            <Link href="/ustawienia-plikow-cookie" className="font-light">Ustawienia plików Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
{/** MObile jest okej ale zmenił design na Dekstopie */}