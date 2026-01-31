import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BackToFullViewButtonProps {
  slug: string;
}

export default function BackToFullViewButton({ slug }: BackToFullViewButtonProps) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/song/${slug}`}
      className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{t('backToFullView')}</span>
    </Link>
  );
}
