import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import LoginForm from '@/components/User/LoginForm';
import RegisterForm from '@/components/User/RegisterForm';

const Logowanie = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register

  return (
    <Layout title="Logowanie">
      <div className="bg-[#F9F6F2] flex justify-center items-center min-h-]]]]">
        <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-md overflow-hidden transition-all duration-500">
          {/* Row 1 - Login Form */}
          <div
            className={`transition-all duration-500 flex ${
              isRegistering ? 'h-[150px]' : 'h-[350px]'
            }`}
          >
            {/* Left Section */}
            <div
              className="p-10 w-1/2"
              style={{
                backgroundImage: `url('/images/image-logowanie.png')`, // Replace with the actual path
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4">
                  Jesteś już użytkownikiem?
                </h2>
                <p className="text-sm text-gray-600">
                  Zaloguj się, aby kontynuować.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 p-10 flex flex-col justify-between">
              {!isRegistering && <LoginForm />}
              {isRegistering && (
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full py-3 px-6 border-2 border-black text-black rounded-full"
                >
                  Zaloguj się
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="px-10">
            <div className="h-[1px] bg-gray-300"></div>
          </div>

          {/* Row 2 - Register Form */}
          <div
            className={`transition-all duration-500 flex ${
              isRegistering ? 'h-[500px]' : 'h-[150px]'
            }`}
          >
            {/* Left Section */}
            <div className="bg-[#CBDBE7] p-10 w-1/2">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-4">
                  Nie masz jeszcze konta?
                </h2>
                <p className="text-sm text-gray-600">
                  Zarejestruj się, aby cieszyć się zakupami.
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 p-10 flex flex-col justify-between">
              {isRegistering && <RegisterForm />}
              {!isRegistering && (
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full py-3 px-6 border-2 border-black text-black rounded-full"
                >
                  Zarejestruj się
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logowanie;
