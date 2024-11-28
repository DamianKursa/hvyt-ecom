import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import LoginForm from '@/components/User/LoginForm';
import RegisterForm from '@/components/User/RegisterForm';

const Logowanie = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register

  return (
    <Layout title="Logowanie">
      <div className="bg-[#F9F6F2] flex justify-center items-center h-screen">
        <div
          className="w-full max-w-5xl bg-white rounded-lg shadow-lg flex"
          style={{ height: '500px' }} // Fixed height for the entire box
        >
          {/* Left Section */}
          <div className="bg-[#E3EDF9] p-10 rounded-l-lg flex flex-col justify-between transition-all duration-500">
            {/* "Jesteś już użytkownikiem?" Section */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                isRegistering ? 'h-[150px]' : 'h-[350px]'
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                Jesteś już użytkownikiem?
              </h2>
              <p className="text-sm text-gray-600">
                Zaloguj się, aby kontynuować.
              </p>
            </div>

            {/* "Nie masz jeszcze konta?" Section */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                isRegistering ? 'h-[350px]' : 'h-[150px]'
              }`}
            >
              <h2 className="text-2xl font-bold mb-4">
                Nie masz jeszcze konta?
              </h2>
              <p className="text-sm text-gray-600">
                Zarejestruj się, aby cieszyć się zakupami.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-[70%] p-10 flex flex-col justify-between">
            <div className="relative flex-1">
              {/* Dynamic Form Rendering */}
              {isRegistering ? (
                <div className="absolute inset-0 transition-transform duration-500 transform translate-y-0">
                  <RegisterForm toggleForm={() => setIsRegistering(false)} />
                </div>
              ) : (
                <div className="absolute inset-0 transition-transform duration-500 transform translate-y-0">
                  <LoginForm toggleForm={() => setIsRegistering(true)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Logowanie;
