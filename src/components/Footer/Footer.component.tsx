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

  const onSubmit = (data) => {
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
            <div className="text-center lg:text-left">
              <img src="/icons/delivery.svg" alt="Delivery Icon" className="h-6 mb-2" />
              <span className="block font-semibold font-size-text-small">Darmowa dostawa</span>
              <span className="block text-black font-light text-sm">Dla zamówień powyżej 300 zł</span>
            </div>
            <div className="text-center lg:text-left">
              <img src="/icons/clock.svg" alt="Clock Icon" className="h-6 mb-2" />
              <span className="block font-semibold font-size-text-small">Wysyłka w 24h</span>
              <span className="block text-black  font-light text-sm">W dni robocze</span>
            </div>
            <div className="text-center lg:text-left">
              <img src="/icons/return.svg" alt="Return Icon" className="h-6 mb-2" />
              <span className="block font-semibold font-size-text-small">30 dni na zwrot</span>
              <span className="block text-black font-light text-sm">Od dnia otrzymania przesyłki</span>
            </div>
            <div className="text-center lg:text-left">
              <img src="/icons/lightning.svg" alt="Lightning Icon" className="h-6 mb-2" />
              <span className="block font-semibold font-size-text-small">Błyskawiczne wsparcie</span>
              <span className="block text-black font-light text-sm">Przez formularz i social <br /> media</span>
            </div>
          </div>
        </div>

        {/* Second Row - Grid with 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Company Info and Links */}
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
                <li><Link href="/uchwyty" className="underline text-regular font-light">Uchwyty</Link></li>
                <li><Link href="/klamki" className="underline text-regular font-light">Klamki</Link></li>
                <li><Link href="/wieszaki" className="underline text-regular font-light">Wieszaki</Link></li>
                <li><Link href="/hvyt-objects" className="underline text-regular font-light">Hvyt Objects</Link></li>
                <li><Link href="/kolekcje" className="underline text-regular font-light">Kolekcje</Link></li>
              </ul>
            </div>

            {/* Second Link Column */}
            <div>
              <ul className="space-y-2">
                <li><Link href="/onas" className="underline text-regular font-light">O nas</Link></li>
                <li><Link href="/kontakt" className="underline text-regular font-light">Kontakt</Link></li>
                <li><Link href="/wspolpraca" className="underline text-regular font-light">Współpraca</Link></li>
                <li><Link href="/dostawa" className="underline text-regular font-light">Dostawa</Link></li>
                <li><Link href="/zwroty-reklamacje" className="underline text-regular font-light">Zwroty i reklamacje</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div className="bg-beige-light rounded-xl p-[24px]">
            <h4 className="text-regular font-semibold mb-4">Zapisz się do newslettera, aby być na bieżąco z nowościami i promocjami.</h4>

            <FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
    {/* InputField for email */}
    <div className="flex-grow">
      <InputField
        inputLabel="Podaj swój adres e-mail"
        inputName="email"
        customValidation={{ required: true }}
        errors={errors}
      />
    </div>
    {/* Button next to input */}
    <button
      type="submit"
      className="ml-4 px-6 py-3 bg-black text-neutral-white rounded-full font-light hover:bg-neutral-dark transition-all"
    >
      Zapisz się
    </button>
  </form>
  
  {/* Consent Text */}
  <p className="text-neutral-darkest text-extra-small font-light">
    Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i na otrzymywanie aktualizacji <br /> od naszej firmy.
  </p>
</FormProvider>

          </div>
        </div>


        {/* Bottom Section */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 py-[32px] border-t border-beige-dark">
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-lg font-semibold mb-4">Nasi partnerzy:</h4>
            <div className="flex items-center space-x-4">
              <Link href="#" aria-label="InPost">
                <img src="/icons/inpost.svg" alt="Inpost Logo" className="h-9" />
              </Link>
              <Link href="#" aria-label="GLS">
                <img src="/icons/GLS_Logo_2021.svg" alt="GLS Logo" className="h-6" />
              </Link>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-6">
            <h4 className="text-lg font-semibold mb-4">Metody płatności:</h4>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <Link href="#" aria-label="BLIK">
                <img src="/icons/blik.svg" alt="BLIK" className="h-6" />
              </Link>
              <Link href="#" aria-label="Przelewy24">
                <img src="/icons/przelewy.svg" alt="Przelewy24" className="h-6" />
              </Link>
              <Link href="#" aria-label="VISA">
                <img src="/icons/visa.svg" alt="VISA" className="h-6" />
              </Link>
              <Link href="#" aria-label="MasterCard">
                <img src="/icons/mastercard.svg" alt="MasterCard" className="h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Legal and Copyright */}
        <div className="py-[32px] flex justify-between border-t border-beige-dark ">
          <p className="text-neutral-darkest font-light">&copy; HvyT. Wszystkie prawa zastrzeżone.</p>
          <div className="text-neutral text-sm">
          <Link href="/regulamin" className="underline mx-2">Regulamin</Link>
            <Link href="/polityka-prywatnosci" className="underline font-light mx-2">Polityka prywatności</Link>
            <Link href="/ustawienia-plikow-cookie" className="underline mx-2">Ustawienia plików Cookie</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

