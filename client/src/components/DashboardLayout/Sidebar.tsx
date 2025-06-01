import React from 'react';
import { ReactComponent as DrivetrainIcon } from '@/assets/icons/subject.svg';
import { ReactComponent as IntakeIcon } from '@/assets/icons/api.svg';
import { ReactComponent as CameraIcon } from '@/assets/icons/camera.svg';
import { ReactComponent as DepositIcon } from '@/assets/icons/widgets.svg';
import { ReactComponent as TelemetryIcon } from '@/assets/icons/chart.svg';

export enum DashboardSection {
  DRIVETRAIN = 'drivetrain',
  INTAKE = 'intake',
  CAMERA = 'camera',
  DEPOSIT = 'deposit',
  TELEMETRY = 'telemetry',
}

interface SidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: DashboardSection.DRIVETRAIN, label: 'Drivetrain', icon: DrivetrainIcon },
    { id: DashboardSection.INTAKE, label: 'Intake', icon: IntakeIcon },
    { id: DashboardSection.CAMERA, label: 'Camera', icon: CameraIcon },
    { id: DashboardSection.DEPOSIT, label: 'Deposit', icon: DepositIcon },
    { id: DashboardSection.TELEMETRY, label: 'Telemetry', icon: TelemetryIcon },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">FTC Dashboard</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <li key={section.id}>
                <button
                  onClick={() => onSectionChange(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        <p>Connected to Robot</p>
      </div>
    </div>
  );
};

export default Sidebar;