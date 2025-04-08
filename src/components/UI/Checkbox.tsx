import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center ml-2 gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`w-5 h-5 flex items-center justify-center border rounded transition-all ${
          checked ? 'bg-black text-white' : 'border-black'
        }`}
      >
        {checked && (
          <img src="/icons/check.svg" alt="check" className="w-3 h-3" />
        )}
      </span>
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
