import React from 'react';

type InputRadioProps = {
  value: string;
  label: React.ReactNode;
  currentValue: string;
  disabled?: boolean;
  name?: string;
  onChange: (value: string) => void;
  className?: string;
};

const InputRadio = ({
  value,
  label,
  currentValue,
  disabled = false,
  name,
  onChange,
  className = '',
}: InputRadioProps) => {
  const checked = currentValue === value;

  return (
    <label
      className={`flex items-center gap-2 min-w-0 ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${className}`.trim()}
    >
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        className={`flex flex-shrink-0 items-center justify-center w-5 h-5 rounded-full border ${
          checked ? 'border-dark-pastel-red' : 'border-gray-400'
        }`}
        aria-hidden
      >
        {checked ? (
          <span className="block w-3 h-3 rounded-full bg-dark-pastel-red" />
        ) : null}
      </span>
      <span className="min-w-0 font-semibold">{label}</span>
    </label>
  );
};

export default InputRadio;
