import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-[rgba(227,167,107,0.24)] py-4">
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/353a20742140fe8d68f681e28e501b3c3cb70d61?placeholderIfAbsent=true" alt="Logo" className="w-12 h-12 rounded-[30px]" />
          <span className="text-[#d4462d] font-bold text-xl">Kopi dari Hati</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/menu" className="text-[#d4462d] font-bold">Menu</Link>
          <Link to="/reservation" className="text-[#d4462d] font-bold">Reservasi</Link>
          <Link to="/login" className="text-[#d4462d] font-bold">Login</Link>
        </div>
      </nav>
    </header>
  );
}
