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
    <div className="flex flex-wrap gap-3 mb-6">
      {tabs.map((tab) => {
        const isSelected = selectedTabs.includes(tab.id);
        return (
          <button
            key={tab.id}
            onClick={() => toggleTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isSelected
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-slate-300 text-slate-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-white border-white'
                  : 'border-slate-400'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-blue-500" />}
            </div>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
