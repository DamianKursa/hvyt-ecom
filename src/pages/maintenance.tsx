import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import MaintenanceScreen from '@/components/Maintenance/MaintenanceScreen';
import { isMaintenanceMode } from '@/utils/maintenance';

const MaintenancePage = () => (
  <>
    <Head>
      <title>Maintenance | HVYT</title>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <MaintenanceScreen />
  </>
);

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (!isMaintenanceMode()) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  res.statusCode = 503;
  res.setHeader('Retry-After', '3600');

  return { props: {} };
};

export default MaintenancePage;
