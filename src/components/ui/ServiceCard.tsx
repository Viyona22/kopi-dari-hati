import React from 'react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="bg-[rgba(227,167,107,0.24)] flex flex-col items-center text-center p-4 rounded-[30px] h-[130px]">
      <img src={icon} alt={title} className="w-6 h-6 object-contain" />
      <h3 className="text-[#d4462d] font-bold text-sm mt-2">{title}</h3>
      <p className="text-[#d4462d] text-xs mt-1">{description}</p>
    </div>
  );
}
