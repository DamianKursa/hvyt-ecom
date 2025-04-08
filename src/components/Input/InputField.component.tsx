import { useFormContext } from 'react-hook-form';

export interface IInputRootObject {
  inputLabel: string;
  inputName: string;
  customValidation: any;
  errors?: any;
  type?: string;
}

export const InputField = ({
  customValidation,
  inputLabel,
  inputName,
  errors,
  type = 'text',
}: IInputRootObject) => {
  const { register } = useFormContext();

  // Base input styles with customized placeholder
  const baseInputClassNames = `
    block w-full py-3 px-2 text-sm font-light border-b
    border-neutral-light bg-transparent text-neutral-darkest 
    placeholder:text-neutral-darkest placeholder:font-light placeholder:text-[16px]
    transition-all duration-300 ease-in-out
    focus:outline-none focus:border-dark-pastel-red
  `;

  const stateClassNames =
    errors && errors[inputName]
      ? 'border-bright-pastel-red'
      : 'border-neutral-light';

  const inputClassNames = `${baseInputClassNames} ${stateClassNames}`;

  return (
    <div className="mb-6">
      {/* Input field */}
      <input
        id={inputName}
        placeholder={inputLabel}
        type={type}
        className={inputClassNames}
        {...register(inputName, { ...customValidation })}
      />

      {/* Error message under input */}
      {errors && errors[inputName] ? (
        <p className="mt-2 text-sm text-bright-pastel-red">
          {errors[inputName].message}
        </p>
      ) : (
        <p className="mt-2 text-sm text-neutral-dark">
          {/* Optional helper text */}
        </p>
      )}
    </div>
  );
};
