import Image from 'next/image';
import { ReactNode } from 'react';

interface ContentSectionProps {
  title: string;
  headerImage: string;
  headerColor: string;
  children: ReactNode;
}

export default function ContentSection({
  title,
  headerImage,
  headerColor,
  children,
}: ContentSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with decorative image */}
      <div className={`relative h-16 ${headerColor}`}>
        <Image
          src={headerImage}
          alt={title}
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center px-4">
          <h3 className="text-white font-bold text-lg drop-shadow-md">
            {title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
