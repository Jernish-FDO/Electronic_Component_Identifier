import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ComponentData } from '../types';
import AnimatedPage from './AnimatedPage';
import { ExternalLinkIcon } from './icons/AppIcons';

// ... (ConfidenceBadge component remains the same)
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


const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Result: React.FC<{ data: ComponentData }> = ({ data }) => {
  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-base-100 p-4 sm:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl bg-base-200 rounded-xl shadow-2xl p-6 sm:p-8"
        >
          {data.imageBase64 && (
            <motion.div variants={itemVariants} className="mb-6 flex justify-center bg-base-300 p-2 rounded-lg">
              <img 
                src={data.imageBase64} 
                alt={data.name} 
                className="rounded-md shadow-lg max-h-64 w-auto object-contain" 
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-base-300 pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-content-100">{data.name}</h1>
              <p className="text-lg text-brand-primary font-medium">{data.type}</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <ConfidenceBadge confidence={data.confidence} />
            </div>
          </motion.div>

          <div className="space-y-6">
            {data.datasheetUrl && (
              <motion.div variants={itemVariants}>
                <a
                  href={data.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all"
                >
                  <ExternalLinkIcon />
                  <span className="ml-2">View Datasheet</span>
                </a>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-content-100 mb-2">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-base-300 p-4 rounded-lg">
                {data.specifications.map((spec) => (
                  <div key={spec.specName} className="flex justify-between border-b border-base-100 py-1">
                    <span className="text-content-200 font-medium">{spec.specName}:</span>
                    <span className="text-content-100 text-right">{spec.specValue}</span>
                  </div>
                ))}
                {data.specifications.length === 0 && (
                  <p className="text-content-200 col-span-2">No specific specifications were identified.</p>
                )}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-content-100 mb-2">Common Usage</h2>
              <p className="text-content-100 bg-base-300 p-4 rounded-lg leading-relaxed">
                {data.commonUsage}
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75 transition-transform transform hover:scale-105"
            >
              Scan Another Component
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Result;