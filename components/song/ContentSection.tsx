import Image from 'next/image';
import { ReactNode } from 'react';

interface ContentSectionProps {
  title: string;
  headerImage: string;
  titleActions?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
}

export default function ContentSection({
  title,
  headerImage,
  titleActions,
  headerActions,
  children,
}: ContentSectionProps) {
  return (
    <div>
      {/* Header with decorative image */}
      <div className="rounded-xl overflow-hidden">
        <Image
          src={headerImage}
          alt={title}
          width={800}
          height={64}
          className="w-full h-auto"
        />
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between py-3 pl-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[#3D5A73] font-bold text-[26px]">{title}</h3>
          {titleActions}
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>

      {/* Content */}
      <div className="pl-3">{children}</div>
    </div>
  );
}
