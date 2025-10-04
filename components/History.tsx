import React from 'react';
import { ComponentData } from '../types';
import { ChevronRightIcon } from './icons/AppIcons'; // Assuming you add this icon

interface HistoryProps {
  items: ComponentData[];
  onViewItem: (item: ComponentData) => void;
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onViewItem, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-base-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-content-100 text-center mb-6">Identification History</h1>
        
        <div className="bg-base-200 rounded-lg shadow-xl">
          {items.length > 0 ? (
            <ul className="divide-y divide-base-300">
              {items.map((item) => (
                <li key={item.id}>
                  <button 
                    onClick={() => onViewItem(item)}
                    className="w-full flex items-center justify-between p-4 hover:bg-base-300 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold text-lg text-white">{item.name}</p>
                      <p className="text-sm text-content-200">{item.type}</p>
                    </div>
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-content-200">
              You haven't identified any components yet. Your history will appear here.
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none"
          >
            Back to Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;