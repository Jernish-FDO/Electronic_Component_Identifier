import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ComponentData } from '../types';
import AnimatedPage from './AnimatedPage';
import { ChevronRightIcon } from './icons/AppIcons';

interface HistoryProps {
  items: ComponentData[];
  onViewItem: (item: ComponentData) => void;
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.1 } },
  hidden: {},
};

const itemVariants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -50 },
};

const History: React.FC<HistoryProps> = ({ items, onViewItem }) => {
  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center bg-base-100 p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-content-100 text-center mb-6">Identification History</h1>
          
          <div className="glass-card rounded-lg">
            {items.length > 0 ? (
              <motion.ul variants={listVariants} initial="hidden" animate="visible">
                {items.map((item, index) => (
                  <motion.li key={item.id} variants={itemVariants} className={`border-b border-white/10 ${index === items.length - 1 ? 'border-b-0' : ''}`}>
                    <motion.button 
                      onClick={() => onViewItem(item)}
                      whileHover={{ backgroundColor: "rgba(224, 224, 255, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {item.imageBase64 && <img src={item.imageBase64} alt={item.name} className="w-12 h-12 object-cover rounded-md bg-base-300" />}
                        <div>
                          <p className="font-semibold text-lg text-content-100">{item.name}</p>
                          <p className="text-sm text-content-200">{item.type}</p>
                        </div>
                      </div>
                      <ChevronRightIcon />
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="p-8 text-center text-content-200">
                You haven't identified any components yet. Your history will appear here.
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-brand-primary text-base-300 font-bold rounded-lg shadow-md hover:brightness-125 focus:outline-none transition-all transform hover:scale-105"
            >
              Back to Scanner
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default History;
