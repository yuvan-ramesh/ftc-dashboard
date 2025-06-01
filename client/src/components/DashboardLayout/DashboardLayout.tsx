import React, { useState } from 'react';
import { connect } from 'react-redux';
import Sidebar, { DashboardSection } from './Sidebar';
import GeneralDashboardBar from '@/components/views/GeneralDashboardBar';
import DrivetrainView from '@/components/subsystems/Drivetrain/DrivetrainView';
import IntakeView from '@/components/subsystems/Intake/IntakeView';
import CameraView from '@/components/views/CameraView';
import DepositView from '@/components/subsystems/Deposit/DepositView';
import EnhancedTelemetryView from '@/components/views/EnhancedTelemetryView';

interface DashboardLayoutProps {
  // Redux state props will be added here
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>(DashboardSection.DRIVETRAIN);

  const renderContent = () => {
    switch (activeSection) {
      case DashboardSection.DRIVETRAIN:
        return <DrivetrainView />;
      case DashboardSection.INTAKE:
        return <IntakeView />;
      case DashboardSection.CAMERA:
        return <CameraView isUnlocked={true} isDraggable={false} />;
      case DashboardSection.DEPOSIT:
        return <DepositView />;
      case DashboardSection.TELEMETRY:
        return <EnhancedTelemetryView />;
      default:
        return <DrivetrainView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* General Dashboard Bar - Always visible at the top */}
        <GeneralDashboardBar />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  // Map relevant state here
});

export default connect(mapStateToProps)(DashboardLayout);