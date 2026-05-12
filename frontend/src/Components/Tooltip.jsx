import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const Tooltip = ({ text }) => {
  return (
    <div className="group relative inline-block ml-1 align-middle">
      <HiOutlineInformationCircle className="text-gray-400 hover:text-[var(--accent-primary)] cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-50 leading-tight">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

export default Tooltip;
