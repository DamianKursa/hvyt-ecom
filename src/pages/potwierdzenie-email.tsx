import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import Link from 'next/link';
import { useI18n } from '@/utils/hooks/useI18n';

const PotwierdzeniePage: React.FC = () => {
  const { t, getPath } = useI18n();
  const router = useRouter();
  const { email, success } = router.query;
  const isActivated =
    success === 'account_activated' || success === '1' || success === 'true';

  return (
    <Layout title={isActivated ? t.auth.activationSuccess : t.account.confirmEmail}>
      <div className="md:mt-0 rounded-[25px] bg-white p-8 shadow-sm flex flex-col items-center justify-center">
        <img
          src="/icons/email-icon.svg"
          alt={t.account.confirmEmail}
          className="w-28 h-28 mb-4"
        />
        {isActivated ? (
          <>
            <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black text-center">
              {t.auth.activationSuccess}
            </h1>
            <Link
              href={getPath('/logowanie')}
              className="mt-4 px-10 py-3 bg-black text-white rounded-full font-light text-[16px]"
            >
              {t.auth.login}
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
              {t.account.confirmEmail}
            </h1>
            <p className="text-[18px] text-black text-center font-light mb-2">
              {t.account.messageEmailLinkSent}: {email}
            </p>
            <p className="text-[18px] text-black text-center font-light mb-6">
              {t.account.messageEmailLinkClick}
            </p>

            <p className="font-semibold mb-2">{t.account.messageLinkProblem}</p>
            <p className="mb-1">{t.account.messageCheckSpam}</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PotwierdzeniePage;
