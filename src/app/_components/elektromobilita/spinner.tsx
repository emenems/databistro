import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <style jsx>{`
        .spinner {
          border: 4px solid #3b82f6; /* Blue border */
          border-left-color: #fff; /* White part that spins */
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;