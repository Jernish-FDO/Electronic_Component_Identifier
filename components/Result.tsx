import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ComponentData } from '../types';
import AnimatedPage from './AnimatedPage';
import { ExternalLinkIcon } from './icons/AppIcons';

const ConfidenceBadge: React.FC<{ confidence: ComponentData['confidence'] }> = ({ confidence }) => {
    let bgColor = 'bg-gray-500';
    if (confidence === 'High') bgColor = 'bg-green-400';
    if (confidence === 'Medium') bgColor = 'bg-yellow-400';
    if (confidence === 'Low') bgColor = 'bg-orange-400';

    return (
        <span className={`px-3 py-1 text-sm font-semibold text-base-300 rounded-full ${bgColor}`}>
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
      staggerChildren: 0.07, // Faster stagger for more items
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
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center bg-base-100 p-4 sm:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl glass-card rounded-xl p-6 sm:p-8"
        >
          {data.imageBase64 && (
            <motion.div variants={itemVariants} className="mb-6 flex justify-center bg-base-300 p-2 rounded-lg">
              <img 
                src={data.imageBase64} 
                alt={data.name} 
                className="rounded-md shadow-lg max-h-60 w-auto object-contain" 
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-content-100">{data.name}</h1>
              <p className="text-lg text-brand-secondary font-medium">{data.type}</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <ConfidenceBadge confidence={data.confidence} />
            </div>
          </motion.div>
          
          {data.description && (
             <motion.p variants={itemVariants} className="text-content-200 border-b border-white/10 pb-4 mb-6">{data.description}</motion.p>
          )}

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center glass-card-nested p-4 rounded-lg">
                <div><span className="text-sm text-content-200 block">Manufacturer</span><span className="text-content-100 font-medium">{data.manufacturer || 'N/A'}</span></div>
                <div><span className="text-sm text-content-200 block">Package</span><span className="text-content-100 font-medium">{data.packageType || 'N/A'}</span></div>
                <div><span className="text-sm text-content-200 block">Category</span><span className="text-content-100 font-medium">{data.applicationCategory || 'N/A'}</span></div>
            </motion.div>

            {data.datasheetUrl && (
              <motion.div variants={itemVariants}>
                <a
                  href={data.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full px-6 py-3 bg-blue-600/50 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition-all"
                >
                  <ExternalLinkIcon />
                  <span className="ml-2">View Datasheet</span>
                </a>
              </motion.div>
            )}

            {data.keyFeatures && data.keyFeatures.length > 0 && (
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-content-100 mb-2">Key Features</h2>
                    <ul className="list-disc list-inside glass-card-nested p-4 rounded-lg space-y-1 text-content-100">
                        {data.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                    </ul>
                </motion.div>
            )}

            {data.pinout && data.pinout.length > 0 && (
                <motion.div variants={itemVariants}>
                    <h2 className="text-xl font-semibold text-content-100 mb-2">Pinout</h2>
                    <div className="overflow-x-auto glass-card-nested rounded-lg">
                        <table className="w-full text-left">
                            <thead className="bg-base-100/50">
                                <tr>
                                    <th className="p-3">Pin</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.pinout.map(pin => (
                                    <tr key={pin.pinNumber} className="border-t border-white/10">
                                        <td className="p-3 font-mono text-center">{pin.pinNumber}</td>
                                        <td className="p-3 font-mono text-brand-secondary">{pin.pinName}</td>
                                        <td className="p-3 text-content-200">{pin.pinDescription}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {data.specifications && data.specifications.length > 0 && (
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold text-content-100 mb-2">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 glass-card-nested p-4 rounded-lg">
                  {data.specifications.map((spec) => (
                    <div key={spec.specName} className="flex justify-between border-b border-white/10 py-1 last:border-b-0">
                      <span className="text-content-200 font-medium">{spec.specName}:</span>
                      <span className="text-content-100 text-right">{spec.specValue}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-content-100 mb-2">Common Usage</h2>
              <p className="text-content-100 glass-card-nested p-4 rounded-lg leading-relaxed">
                {data.commonUsage}
              </p>
            </motion.div>

            {(data.functionalBlocks && data.functionalBlocks.length > 0 || data.substitutes && data.substitutes.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.functionalBlocks && data.functionalBlocks.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-content-100 mb-2">Functional Blocks</h2>
                        <div className="flex flex-wrap gap-2 glass-card-nested p-4 rounded-lg">
                            {data.functionalBlocks.map(block => (
                                <span key={block} className="bg-base-100 text-brand-primary text-sm font-medium px-3 py-1 rounded-full">{block}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
                {data.substitutes && data.substitutes.length > 0 && (
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-content-100 mb-2">Substitutes</h2>
                        <div className="flex flex-wrap gap-2 glass-card-nested p-4 rounded-lg">
                            {data.substitutes.map(sub => (
                                <span key={sub} className="bg-base-100 text-brand-secondary text-sm font-medium px-3 py-1 rounded-full">{sub}</span>
                            ))}
                        </div>
                    </motion.div>
                )}
              </div>
            )}
          </div>

          <motion.div variants={itemVariants} className="mt-10 text-center">
            <Link
              to="/"
              className="w-full sm:w-auto inline-block px-8 py-3 bg-brand-primary text-base-300 font-bold rounded-lg shadow-md hover:brightness-125 focus:outline-none transition-transform transform hover:scale-105"
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
