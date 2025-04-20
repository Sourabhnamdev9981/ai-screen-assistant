import React, { useEffect } from 'react';

function Toast({ message, onClose, type = 'success' }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'error'
      ? 'bg-red-600 dark:bg-red-500'
      : 'bg-green-600 dark:bg-green-500';

  return (
    <div
      className={`fixed bottom-6 right-6 text-white px-4 py-2 rounded shadow-lg animate-fade-in ${bgColor}`}
    >
      {message}
    </div>
  );
}

export default Toast;
