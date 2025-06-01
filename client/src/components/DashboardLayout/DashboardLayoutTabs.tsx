import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DashboardSection } from './Sidebar';
import TabNavigation from './TabNavigation';
import GeneralDashboardBar from '@/components/views/GeneralDashboardBar';
import DrivetrainView from '@/components/subsystems/Drivetrain/DrivetrainView';
import IntakeView from '@/components/subsystems/Intake/IntakeView';
import CameraFeedView from '@/components/views/CameraFeedView';
import DepositView from '@/components/subsystems/Deposit/DepositView';
import EnhancedTelemetryView from '@/components/views/EnhancedTelemetryView';
import NavigationInstructions from './NavigationInstructions';

interface DashboardLayoutTabsProps {
  // Redux state props will be added here
}

const DashboardLayoutTabs: React.FC<DashboardLayoutTabsProps> = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>(DashboardSection.DRIVETRAIN);

  const renderContent = () => {
    switch (activeSection) {
      case DashboardSection.DRIVETRAIN:
        return <DrivetrainView />;
      case DashboardSection.INTAKE:
        return <IntakeView />;
      case DashboardSection.CAMERA:
        return <CameraFeedView isUnlocked={true} isDraggable={false} />;
      case DashboardSection.DEPOSIT:
        return <DepositView />;
      case DashboardSection.TELEMETRY:
        return <EnhancedTelemetryView />;
      default:
        return <DrivetrainView />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* General Dashboard Bar - Always visible at the top */}
      <GeneralDashboardBar />
      
      {/* Tab Navigation */}
      <TabNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Show instructions on first load */}
        {activeSection === DashboardSection.DRIVETRAIN && (
          <NavigationInstructions />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  // Map relevant state here
});

export default connect(mapStateToProps)(DashboardLayoutTabs);