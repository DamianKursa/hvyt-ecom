import React from 'react';

const PasswordChangeConfirmation: React.FC<{ onBackToLogin: () => void }> = ({
  onBackToLogin,
}) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-auto md:h-[340px] bg-white rounded-[40px] shadow-md">
      {/* Left Section */}
      <div
        className="p-10 w-full md:w-1/2 flex flex-col"
        style={{
          backgroundImage: `url('/images/image-logowanie.png')`, // Update the image path if necessary
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-2xl font-bold text-black">Nie pamiętam hasła</h1>
      </div>

      {/* Right Section */}
      <div className="p-10 w-full md:w-1/2 flex flex-col justify-center items-center">
        {/* Success Message */}
        <div className="bg-[#41464B] p-4 rounded-lg text-black flex items-center gap-3 mb-6 w-full">
          <img
            src="/icons/check-in-icon.svg"
            alt="Success"
            className="w-6 h-6"
          />
          <span className="font-light text-[14px] text-[#fff]">
            Jeśli ten adres e-mail jest w bazie, to wysłaliśmy na niego link do
            zmiany hasła.
          </span>
        </div>

        {/* Additional Information */}
        <p className="text-[16px] font-light text-black mb-6 w-full">
          Nie dotarł do Ciebie mail?
          <ol className="list-decimal list-inside text-[16px] mt-2">
            <li>Zajrzyj do folderu ze spamem.</li>
            <li>Sprawdź czy podany adres jest poprawny.</li>
            <li>Odczekaj 15 minut i spróbuj ponownie.</li>
          </ol>
        </p>

        {/* Back to Login Button */}
        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full py-3 bg-black text-white rounded-full"
        >
          Wróć do logowania
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeConfirmation;
