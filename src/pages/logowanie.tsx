import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout.component';
import LoginForm from '@/components/User/LoginForm';
import RegisterForm from '@/components/User/RegisterForm';
import ForgotPassword from '@/components/User/ForgotPassword'; // Import the ForgotPassword component

const Logowanie = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle between login and forgot password

  return (
    <Layout title="Hvyt | Logowanie">
      <div className="bg-[#F9F6F2] flex justify-center items-center mt-12 ">
        <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-md overflow-hidden transition-all duration-500">
          {!isForgotPassword ? (
            <>
              {/* Row 1 - Login Form */}
              <div
                className={`transition-all duration-500 flex ${
                  isRegistering ? 'md:h-[150px]' : 'md:h-[340px]'
                } flex-col md:flex-row h-auto`}
              >
                {/* Left Section */}
                <div
                  className="p-10 w-full md:w-1/2 flex flex-col justify-start"
                  style={{
                    backgroundImage: `url('/images/image-logowanie.png')`, // Replace with the actual path
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
                    Jesteś już użytkownikiem?
                  </h2>
                </div>

                {/* Right Section */}
                <div className="p-10 w-full md:w-1/2 flex flex-col justify-between">
                  {!isRegistering && (
                    <LoginForm
                      onForgotPassword={() => setIsForgotPassword(true)} // Pass handler to LoginForm
                    />
                  )}
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
              <div className="px-10 md:px-0">
                <div className="h-[1px] bg-gray-300"></div>
              </div>

              {/* Row 2 - Register Form */}
              <div
                className={`transition-all duration-500 flex ${
                  isRegistering ? 'md:h-[500px]' : 'md:h-[150px]'
                } flex-col md:flex-row h-auto`}
              >
                {/* Left Section */}
                <div className="bg-[#CBDBE7] p-10 w-full md:w-1/2 flex flex-col justify-start">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
                    Nie masz jeszcze konta?
                  </h2>
                </div>

                {/* Right Section */}
                <div className="p-10 w-full md:w-1/2 flex flex-col justify-between">
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
            </>
          ) : (
            <ForgotPassword
              onBackToLogin={() => setIsForgotPassword(false)} // Pass handler to ForgotPassword
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Logowanie;
