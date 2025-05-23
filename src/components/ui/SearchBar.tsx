import React from 'react';

export function SearchBar() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-gray-200 p-2">
        <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/acccc4b0659b1b0619b968f2c591e20cac2c49fa?placeholderIfAbsent=true" alt="Search" className="w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none flex-1"
        />
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/29a96d165ced5a2242dfe58c621e16f12ee4d185?placeholderIfAbsent=true" alt="Menu" className="w-[72px] h-[53px] rounded-[50px]" />
    </div>
  );
}
