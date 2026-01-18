import { useSongStore } from '@/store/songStore';
import { ContentTab } from '@/types/song';
import { Check } from 'lucide-react';

interface TabConfig {
  id: ContentTab;
  label: string;
}

const tabs: TabConfig[] = [
  { id: 'paroles', label: 'Paroles' },
  { id: 'partitions', label: 'Partitions' },
  { id: 'traductions', label: 'Traductions' },
  { id: 'histoire', label: 'Histoire' },
];

export default function ContentTabs() {
  const { selectedTabs, toggleTab } = useSongStore();

  return (
    <div className="inline-flex items-center gap-1 p-1.5 bg-slate-100 rounded-full mb-6">
      {tabs.map((tab) => {
        const isSelected = selectedTabs.includes(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => toggleTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
              isSelected
                ? 'bg-[#3D5A73] text-white'
                : 'text-[#466387] hover:bg-slate-200'
            }`}
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-white'
                  : 'border-2 border-[#466387]'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-[#3D5A73]" />}
            </div>
            <span className="mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
