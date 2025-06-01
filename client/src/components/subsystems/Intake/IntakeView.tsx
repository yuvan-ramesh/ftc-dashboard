import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { setIntakeSlideTarget } from '@/store/actions/subsystems';
import SliderControl from '../shared/SliderControl';
import PIDGraph from '../shared/PIDGraph';
import SensorValueDisplay from '../shared/SensorValueDisplay';
import ClawStatusIndicator from './ClawStatusIndicator';
import IntakeStateDisplay from './IntakeStateDisplay';
import ServoPositionIndicator from '../shared/ServoPositionIndicator';
import SubsystemTelemetry from '../shared/SubsystemTelemetry';

const IntakeView: React.FC = () => {
  const intake = useSelector((state: RootState) => state.subsystems.intake);
  const dispatch = useDispatch();
  
  const handleSlideTargetChange = (value: number) => {
    dispatch(setIntakeSlideTarget(value));
  };
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Intake System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Slide Control */}
        <div className="lg:col-span-2 xl:col-span-1">
          <SliderControl
            label="Slide Position"
            value={intake.slidePosition}
            target={intake.slideTarget}
            min={intake.slideMin}
            max={intake.slideMax}
            unit="mm"
            onTargetChange={handleSlideTargetChange}
            color="blue"
          />
        </div>
        
        {/* Claw Status */}
        <div className="lg:col-span-1">
          <ClawStatusIndicator
            hasSample={intake.hasSample}
            servoPosition={intake.servoPosition}
          />
        </div>
        
        {/* Intake State */}
        <div className="lg:col-span-1">
          <IntakeStateDisplay
            state={intake.state}
            slidePosition={intake.slidePosition}
            slideTarget={intake.slideTarget}
          />
        </div>
        
        {/* Multiple Servo Indicators */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-medium mb-4">Servo Positions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ServoPositionIndicator
                position={intake.servos?.claw || intake.servoPosition}
                maxDegrees={360}
                label="Claw Servo"
                size={120}
                color="#3B82F6"
              />
              <ServoPositionIndicator
                position={intake.servos?.wrist || 90}
                maxDegrees={360}
                label="Wrist Servo"
                size={120}
                color="#10B981"
              />
              <ServoPositionIndicator
                position={intake.servos?.arm || 45}
                maxDegrees={360}
                label="Arm Servo"
                size={120}
                color="#F59E0B"
              />
              <ServoPositionIndicator
                position={intake.servos?.rotation || 180}
                maxDegrees={360}
                label="Rotation Servo"
                size={120}
                color="#EF4444"
              />
            </div>
          </div>
        </div>
        
        {/* Sensor Values */}
        <div className="lg:col-span-2 xl:col-span-3">
          <SensorValueDisplay
            sensors={intake.sensors}
            title="Intake Sensors"
            columns={3}
          />
        </div>
        
        {/* PID Graph */}
        <div className="lg:col-span-2 xl:col-span-3">
          <PIDGraph
            subsystem="intake"
            title="Intake Slide PID Performance"
            height={300}
          />
        </div>
        
        {/* Telemetry Section */}
        <div className="lg:col-span-2 xl:col-span-3">
          <SubsystemTelemetry
            subsystemId="intake"
            subsystemName="Intake"
          />
        </div>
      </div>
    </div>
  );
};

export default IntakeView;