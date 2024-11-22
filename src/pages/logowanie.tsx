import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import LoginForm from '@/components/User/LoginForm';
import RegisterForm from '@/components/User/RegisterForm';

const Logowanie = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

  return (
    <Layout title="Logowanie">
      <div className="bg-[#F9F6F2] flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex">
          {/* Left Section */}
          <div className="w-1/2 p-6 bg-[#E3EDF9] rounded-l-lg flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin
                ? 'Jesteś już użytkownikiem?'
                : 'Nie masz jeszcze konta?'}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {isLogin
                ? 'Zaloguj się, aby kontynuować.'
                : 'Zarejestruj się, aby cieszyć się zakupami.'}
            </p>
            <img
              src="/icons/left-placeholder-image.png"
              alt="Placeholder"
              className="w-full rounded-lg"
            />
          </div>

          {/* Right Section */}
          <div className="w-1/2 p-8">
            <div className="flex justify-between mb-6">
              <button
                className={`font-bold px-4 py-2 rounded-lg ${
                  isLogin
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Zaloguj się
              </button>
              <button
                className={`font-bold px-4 py-2 rounded-lg ${
                  !isLogin
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Zarejestruj się
              </button>
            </div>
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logowanie;
