import React from 'react';

const NavigationInstructions: React.FC = () => {
  return (
    <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-4">
      <h3 className="text-blue-400 font-medium mb-2">Navigation Instructions</h3>
      <p className="text-sm text-gray-300">
        Use the tabs above to switch between different subsystem dashboards:
      </p>
      <ul className="mt-2 text-sm text-gray-400 space-y-1">
        <li>• <strong>Drivetrain</strong> - Position, velocity, encoders, and field view</li>
        <li>• <strong>Intake</strong> - Slide position, claw status, and sensors</li>
        <li>• <strong>Camera</strong> - Live camera feed and object detection</li>
        <li>• <strong>Deposit</strong> - Deposit slide and status monitoring</li>
        <li>• <strong>Telemetry</strong> - All telemetry data with pause/record/replay</li>
      </ul>
    </div>
  );
};

export default NavigationInstructions;