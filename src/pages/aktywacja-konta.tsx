import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout.component';
import { useI18n } from '@/utils/hooks/useI18n';

const ActivationPage: React.FC = () => {
  const {t} = useI18n();
  const router = useRouter();
  const { email } = router.query;

  return (
    <Layout title={t.account.confirmEmail}>
      <div className="bg-[#F5F5F2] flex items-center justify-center px-4 py-8">
        <div className="w-[1000px] md:mt-0 rounded-[25px] bg-white p-8 shadow-sm">
          <div className="max-w-[600px] w-full flex flex-col items-center justify-center mx-auto">
            <h1 className="text-[18px] md:text-[28px] font-semibold mb-4 text-black">
              {t.account.confirmEmail}
            </h1>
            <img
              src="/icons/email-icon.svg"
              alt={t.account.confirmEmail}
              className="w-28 h-28 mb-4"
            />

            <p className="text-[18px] text-black text-center font-light mb-2">
              {t.account.messageEmailLinkSent}: {email}
            </p>
            <p className="text-[18px] text-black text-center font-light mb-6">
              {t.account.messageEmailLinkClick}
            </p>
            <div className="mt-6 space-y-2 text-center">
              <p className="font-bold">{t.account.messageLinkProblem}</p>
              <p className="text-sm">
                {t.account.messageCheckSpam}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivationPage;
