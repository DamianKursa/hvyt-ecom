import { useI18n } from '@/utils/hooks/useI18n';

const CONTACT_EMAIL = 'hello@hvyt.pl';

const MaintenanceScreen = () => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-beige px-5 py-12 text-center text-neutral-darkest">
      <img
        src="/images/Logo.svg"
        alt="HVYT"
        className="mb-8 w-[200px] max-w-full"
      />
      <h1 className="mb-4 text-[32px] font-bold md:text-[40px]">
        {t.index.maintenanceTitle}
      </h1>
      <p className="mb-4 max-w-xl text-[18px] font-light leading-relaxed">
        {t.index.maintenanceDescription}
      </p>
      <p className="mb-2 text-[16px]">{t.index.maintenanceContact}</p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="text-[18px] font-bold underline hover:text-dark-pastel-red"
      >
        {CONTACT_EMAIL}
      </a>
    </div>
  );
};

export default MaintenanceScreen;
