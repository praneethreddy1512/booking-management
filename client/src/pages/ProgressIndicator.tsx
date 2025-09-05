import React from 'react';

interface Props {
  step: number;
}

const steps = [
  'Service',
  'Provider',
  'Date & Time',
  'Your Info',
  'Review',
  'Success'
];

const ProgressIndicator: React.FC<Props> = ({ step }) => (
  <div className="w-full mb-8">
    <div className="flex justify-between items-center max-w-4xl mx-auto px-4">
      {steps.map((label, index) => {
        const isCompleted = index < step;
        const isActive = index === step;

        return (
          <div key={index} className="flex-1 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold border ${
                isCompleted ? 'bg-green-500 text-white border-green-500' :
                isActive ? 'bg-blue-500 text-white border-blue-500' :
                'bg-gray-200 text-gray-600 border-gray-300'
              }`}
            >
              {index + 1}
            </div>
            <div className={`mt-2 text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ProgressIndicator;
