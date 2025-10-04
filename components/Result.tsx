import React from 'react';
import { ComponentData } from '../types';
import { CircuitBoardIcon } from './icons/AppIcons';

interface ResultProps {
  data: ComponentData;
  onReset: () => void;
}

const ConfidenceBadge: React.FC<{ confidence: ComponentData['confidence'] }> = ({ confidence }) => {
    let bgColor = 'bg-gray-500';
    if (confidence === 'High') bgColor = 'bg-green-500';
    if (confidence === 'Medium') bgColor = 'bg-yellow-500';
    if (confidence === 'Low') bgColor = 'bg-orange-500';

    return (
        <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${bgColor}`}>
            {confidence} Confidence
        </span>
    );
};

const Result: React.FC<ResultProps> = ({ data, onReset }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-base-200 rounded-xl shadow-lg border-2 border-gray-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-base-300 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-content-100">{data.name}</h1>
            <p className="text-lg text-brand-primary font-medium">{data.type}</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ConfidenceBadge confidence={data.confidence} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-content-100 mb-2">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-gray-50 p-4 rounded-lg border">
              {data.specifications.map((spec) => (
                <div key={spec.specName} className="flex justify-between border-b border-base-300 py-1">
                  <span className="text-content-200 font-medium">{spec.specName}:</span>
                  <span className="text-content-100 text-right">{spec.specValue}</span>
                </div>
              ))}
              {data.specifications.length === 0 && (
                <p className="text-content-200 col-span-2">No specific specifications were identified.</p>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-content-100 mb-2">Common Usage</h2>
            <p className="text-content-100 bg-gray-50 p-4 rounded-lg leading-relaxed border">
              {data.commonUsage}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Scan Another Component
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;