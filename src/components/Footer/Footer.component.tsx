import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm, FormProvider } from 'react-hook-form';
import { InputField } from '../Input/InputField.component';
import SocialIcons from '../UI/SocialIcons';
import { normalizeString } from '@/utils/functions/functions'; // Import normalizeString

const Footer = () => {
  const router = useRouter();
  const isSpecialPage =
    router.pathname.startsWith('/produkt') ||
    router.pathname.startsWith('/kategoria');

  const methods = useForm({
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: any) => {
    console.log('Newsletter form data:', data);
  };

  // Mapping for category links
  const categoryLinks: { [key: string]: string } = {
    Uchwyty: 'uchwyty-meblowe',
    Klamki: 'klamki',
    Wieszaki: 'wieszaki',
    Gałki: 'galki',
  };

  return (
    <footer
      className={`${
        isSpecialPage ? 'bg-beige-light' : 'bg-beige'
      } py-16 text-sm text-neutral-darkest`}
    >
      <div className="max-w-[1440px] container px-[16px] md:mx-auto">
        {/* First Row - Grid with 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-beige-dark pb-8 mb-8">
          {/* Left Column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 space-y-0 md:space-y-4">
            {/* Logo */}
            <img
              src="/icons/Logo.svg"
              alt="HVYT Logo"
              className="h-[20px] md:h-10"
            />

            {/* Social Media Icons */}
            <SocialIcons />
          </div>

          {/* Service Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                src: '/icons/delivery.svg',
                title: 'Darmowa dostawa',
                desc: 'Dla zamówień powyżej 300 zł',
              },
              {
                src: '/icons/clock.svg',
                title: 'Wysyłka w 24h',
                desc: 'W dni robocze',
              },
              {
                src: '/icons/return.svg',
                title: '30 dni na zwrot',
                desc: 'Od dnia otrzymania przesyłki',
              },
              {
                src: '/icons/lightning.svg',
                title: 'Błyskawiczne wsparcie',
                desc: 'Przez formularz i social media',
              },
            ].map((item, index) => (
              <div key={index} className="text-left">
                <img src={item.src} alt={item.title} className="h-6 mb-2" />
                <span className="block font-semibold font-size-text-small">
                  {item.title}
                </span>
                <span className="block text-black font-light text-sm">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Grid with 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="grid grid-cols-2 lg:grid-cols-1">
              <div>
                <h4 className="text-lg font-semibold">Dane firmowe:</h4>
                <p className="text-regular font-light">
                  HVYT by Marta Wontorczyk
                </p>
                <p className="text-regular font-light">NIP: 6762570584</p>
                <p className="text-regular font-light">REGON: 384282914</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold lg:mt-[24px]">Kontakt</h4>
                <p className="text-regular font-light">hello@hvyt.pl</p>
              </div>
            </div>

            {/* First Link Column */}
            <div className="grid grid-cols-2 lg:grid-cols-2 lg:cols-span-1">
              <div>
                <ul className="space-y-2">
                  {[
                    'Uchwyty',
                    'Klamki',
                    'Wieszaki',
                    'Gałki',
                    'Kolekcje',
                    'Blog',
                  ].map((link, index) => {
                    const href = categoryLinks[link]
                      ? `/kategoria/${categoryLinks[link]}`
                      : `/${normalizeString(link)}`;
                    return (
                      <li key={index}>
                        <Link
                          href={href}
                          className="underline text-black text-[16px] font-light"
                        >
                          {link}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {[
                    'O nas',
                    'Kontakt',
                    'Współpraca',
                    'Dostawa',
                    'Zwroty i reklamacje',
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={`/${normalizeString(link)}`}
                        className="underline text-[16px] text-black font-light"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-beige-light rounded-xl p-[24px]">
            <h4 className="text-regular font-semibold mb-4">
              Zapisz się do newslettera, aby być na bieżąco z nowościami i
              promocjami.
            </h4>

            {/* Mobile Version */}
            <div className="block md:hidden">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col"
                >
                  <div className="flex-grow">
                    <InputField
                      inputLabel="Podaj swój adres e-mail"
                      inputName="email"
                      customValidation={{ required: true }}
                      errors={errors}
                    />
                  </div>
                  <p className="text-neutral-darkest text-extra-small font-light mt-4">
                    Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i
                    na otrzymywanie aktualizacji <br /> od naszej firmy.
                  </p>
                  <button
                    type="submit"
                    className="mt-4 w-full px-6 py-3 bg-black text-neutral-white rounded-full font-light hover:bg-neutral-dark transition-all"
                  >
                    Zapisz się
                  </button>
                </form>
              </FormProvider>
            </div>

            {/* Desktop Version */}
            <div className="hidden md:block">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex items-center"
                >
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
                <p className="text-neutral-darkest text-extra-small font-light mt-4">
                  Subskrybując, wyrażasz zgodę na naszą Politykę prywatności i
                  na otrzymywanie aktualizacji od naszej firmy.
                </p>
              </FormProvider>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 py-[32px] border-t border-beige-dark">
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-lg font-semibold mb-4">Nasi partnerzy:</h4>
            <div className="flex items-center space-x-4">
              <Link href="#">
                <img
                  src="/icons/inpost.svg"
                  alt="InPost Logo"
                  className="h-9"
                />
              </Link>
              <Link href="#">
                <img
                  src="/icons/GLS_Logo_2021.svg"
                  alt="GLS Logo"
                  className="h-6"
                />
              </Link>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-6">
            <h4 className="text-lg font-semibold mb-4">Metody płatności:</h4>
            <div className="flex items-center space-x-4">
              {['blik', 'przelewy', 'visa', 'mastercard'].map(
                (payment, index) => (
                  <Link href="#" key={index}>
                    <img
                      src={`/icons/${payment}.svg`}
                      alt={payment.toUpperCase()}
                      className="h-6"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="py-[32px] flex justify-between grid grid-cols-1 lg:grid-cols-2 border-t border-beige-dark">
          <p className="mt-[24px] text-regular text-black font-light">
            &copy; HVYT. Wszystkie prawa zastrzeżone.
          </p>
          <div className="gap-4 flex flex-col order-first lg:order-last lg:flex-row lg:justify-end text-regular text-black font-light underline">
            <Link href="/regulamin" className="underline lg:mx-2">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className="underline lg:mx-2">
              Polityka prywatności
            </Link>
            <Link
              href="/ustawienia-plikow-cookie"
              className="underline lg:mx-2"
            >
              Ustawienia plików Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
