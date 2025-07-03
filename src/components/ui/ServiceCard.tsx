
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`bg-[rgba(227,167,107,0.24)] flex flex-col items-center text-center ${isMobile ? 'p-6 rounded-2xl min-h-[160px]' : 'p-4 rounded-[30px] h-[130px]'}`}>
      <img src={icon} alt={title} className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} object-contain`} />
      <h3 className={`text-[#d4462d] font-bold ${isMobile ? 'text-base mt-3' : 'text-sm mt-2'}`}>{title}</h3>
      <p className={`text-[#d4462d] ${isMobile ? 'text-sm mt-2 leading-relaxed' : 'text-xs mt-1'}`}>{description}</p>
    </div>
  );
}
