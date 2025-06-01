import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import PositionDisplay from './PositionDisplay';
import VelocityAccelerationChart from './VelocityAccelerationChart';
import EncoderValues from './EncoderValues';
import CenterOfGravityIndicator from './CenterOfGravityIndicator';
import PIDGraph from '../shared/PIDGraph';
import SensorValueDisplay from '../shared/SensorValueDisplay';
import FieldMapView from './FieldMapView';
import SubsystemTelemetry from '../shared/SubsystemTelemetry';

const DrivetrainView: React.FC = () => {
  const drivetrain = useSelector((state: RootState) => state.subsystems.drivetrain);
  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Drivetrain System</h2>
      
      {/* Field Map - First thing shown */}
      <div className="mb-6">
        <FieldMapView />
      </div>
      
      {/* Other drivetrain components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Position and Heading */}
        <div className="lg:col-span-1">
          <PositionDisplay
            position={drivetrain.position}
            heading={drivetrain.heading}
          />
        </div>
        
        {/* Velocity and Acceleration */}
        <div className="lg:col-span-1">
          <VelocityAccelerationChart
            velocity={drivetrain.velocity}
            acceleration={drivetrain.acceleration}
          />
        </div>
        
        {/* Center of Gravity */}
        <div className="lg:col-span-1">
          <CenterOfGravityIndicator
            centerOfGravity={drivetrain.centerOfGravity}
          />
        </div>
        
        {/* Encoder Values */}
        <div className="lg:col-span-1">
          <EncoderValues encoders={drivetrain.encoders} />
        </div>
        
        {/* Sensor Values */}
        <div className="lg:col-span-2">
          <SensorValueDisplay
            sensors={drivetrain.sensors}
            title="Additional Sensors"
            columns={3}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        
        {/* PID Graph */}
        <div className="lg:col-span-3">
          <PIDGraph
            subsystem="drivetrain"
            title="Drivetrain PID Performance"
            height={350}
          />
        </div>
        
        {/* Telemetry Section */}
        <div className="lg:col-span-3">
          <SubsystemTelemetry
            subsystemId="drivetrain"
            subsystemName="Drivetrain"
          />
        </div>
      </div>
    </div>
  );
};

export default DrivetrainView;