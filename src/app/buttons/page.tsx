import React, { useState } from 'react';
import { LayoutGrid, Settings, Users, ArrowRightToLine } from 'lucide-react';

type Tab = 'Apps' | 'Settings' | 'Users';

const SegmentedControl = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Users');

  const tabs = [
    { id: 'Apps', icon: <LayoutGrid size={20} />, label: 'Apps' },
    { id: 'Settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'Users', icon: <Users size={20} />, label: 'Users' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] font-sans">
      {/* Main Container */}
      <div className="relative flex items-center bg-[#1a1a1a] border border-white/10 rounded-full p-1 h-16">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                relative flex items-center justify-center gap-3 px-8 h-full transition-all duration-300
                ${index === 0 ? 'rounded-l-full' : ''}
                ${index === tabs.length - 1 ? 'rounded-r-full' : ''}
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
              `}
              style={{
                // Creating the skewed/parallelogram effect
                clipPath: index === 0 
                  ? 'polygon(0% 0%, 90% 0%, 100% 100%, 0% 100%)' 
                  : index === 1 
                  ? 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)'
                  : 'polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)',
                marginLeft: index === 0 ? '0' : '-12px',
              }}
            >
              {/* Blue Border Highlight for Active Tab */}
              {isActive && (
                <div 
                  className="absolute inset-0 border-2 border-[#3498db] shadow-[0_0_15px_rgba(52,152,219,0.3)] z-10 pointer-events-none"
                  style={{
                    borderRadius: index === 0 ? '999px 0 0 999px' : index === 2 ? '0 999px 999px 0' : '0',
                    clipPath: 'inherit'
                  }}
                />
              )}

              {/* Tab Content */}
              <span className="relative z-20 flex items-center gap-2 text-xl font-medium">
                {tab.icon}
                {tab.label}
              </span>

              {/* Subtle Divider for non-active tabs */}
              {index < tabs.length - 1 && !isActive && activeTab !== tabs[index+1].id && (
                <div className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-white/10 skew-x-[-15deg]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Icon from Image */}
      <div className="mt-12 p-2 bg-[#1a1a1a] border border-white/20 rounded-lg text-white">
        <ArrowRightToLine size={24} />
      </div>
    </div>
  );
};

export default SegmentedControl;
