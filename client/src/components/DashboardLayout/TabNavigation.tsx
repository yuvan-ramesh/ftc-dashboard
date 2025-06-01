import React from 'react';
import { DashboardSection } from './Sidebar';

interface TabNavigationProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeSection, onSectionChange }) => {
  const tabs = [
    { id: DashboardSection.DRIVETRAIN, label: 'Drivetrain' },
    { id: DashboardSection.INTAKE, label: 'Intake' },
    { id: DashboardSection.CAMERA, label: 'Camera' },
    { id: DashboardSection.DEPOSIT, label: 'Deposit' },
    { id: DashboardSection.TELEMETRY, label: 'Telemetry' },
  ];

  return (
    <div className="border-b-2 border-gray-700 bg-gray-800 shadow-lg">
      <div className="flex space-x-2 px-6 py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSectionChange(tab.id)}
            className={`px-6 py-3 text-base font-medium transition-all rounded-t-lg ${
              activeSection === tab.id
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;