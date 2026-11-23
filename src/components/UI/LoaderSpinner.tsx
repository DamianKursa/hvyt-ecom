import React from 'react';

const LoaderSpinner = ({
  className = 'animate-spin mb-4 w-12 h-12',
}: {
  className?: string;
}) => (
  <img
    src="/icons/logowanie-spinner.svg"
    alt="Loading Spinner"
    className={className}
  />
);

export default LoaderSpinner;
