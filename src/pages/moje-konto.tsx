import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Profile from '../components/User/Profile';
import { parseCookies } from '@/utils/cookies';
import Layout from '@/components/Layout/Layout.component';
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { token } = parseCookies(context.req.headers.cookie || '');

  if (!token) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // No specific props are required here
  };
};

const MojeKonto = () => {
  return (
    <Layout title="Moje konto">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Moje konto</h1>
        <Profile />
      </div>
    </Layout>
  );
};

export default MojeKonto;
