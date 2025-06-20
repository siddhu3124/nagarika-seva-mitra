
import React from 'react';

interface ValidationErrorsProps {
  errors: string[];
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3">
      <ul className="list-disc list-inside text-red-600 text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationErrors;
