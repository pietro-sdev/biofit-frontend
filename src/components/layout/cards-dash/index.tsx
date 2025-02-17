'use client';
import { ReactNode } from 'react';

interface CardDashProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function CardsDash({
  icon,
  title,
  value,
}: CardDashProps) {
  return (
    <div className="flex items-center space-x-3 p-4 bg-white border-[1.2px] rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100">
        {icon}
      </div>
      <div>
        <p className="text-zinc-400 font-medium">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
