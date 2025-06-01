import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { setDepositSlideTarget } from '@/store/actions/subsystems';
import SliderControl from '../shared/SliderControl';
import PIDGraph from '../shared/PIDGraph';
import SensorValueDisplay from '../shared/SensorValueDisplay';
import DepositStateDisplay from './DepositStateDisplay';
import ServoPositionIndicator from '../shared/ServoPositionIndicator';
import SubsystemTelemetry from '../shared/SubsystemTelemetry';

const DepositView: React.FC = () => {
  const deposit = useSelector((state: RootState) => state.subsystems.deposit);
  const dispatch = useDispatch();
  
  const handleSlideTargetChange = (value: number) => {
    dispatch(setDepositSlideTarget(value));
  };
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Deposit System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Slide Control */}
        <div className="lg:col-span-2 xl:col-span-1">
          <SliderControl
            label="Deposit Slide Position"
            value={deposit.slidePosition}
            target={deposit.slideTarget}
            min={deposit.slideMin}
            max={deposit.slideMax}
            unit="mm"
            onTargetChange={handleSlideTargetChange}
            color="green"
          />
        </div>
        
        {/* Deposit State */}
        <div className="lg:col-span-1">
          <DepositStateDisplay
            state={deposit.state}
            isDeposited={deposit.isDeposited}
            slidePosition={deposit.slidePosition}
            slideTarget={deposit.slideTarget}
          />
        </div>
        
        
        {/* Deposit Status Indicator */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 h-full">
            <h3 className="text-white text-lg font-medium mb-4">Deposit Status</h3>
            
            <div className={`rounded-lg p-6 text-center ${
              deposit.isDeposited 
                ? 'bg-green-900 bg-opacity-20 border border-green-500' 
                : 'bg-gray-700'
            }`}>
              <div className="text-4xl mb-2">
                {deposit.isDeposited ? '✅' : '📦'}
              </div>
              <div className={`text-lg font-medium ${
                deposit.isDeposited ? 'text-green-400' : 'text-gray-400'
              }`}>
                {deposit.isDeposited ? 'Sample Deposited' : 'Ready to Deposit'}
              </div>
              
              {/* Visual progress indicator */}
              <div className="mt-4 relative h-2 bg-gray-600 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${
                  deposit.isDeposited ? 'bg-green-500' : 'bg-gray-500'
                }`} style={{ width: deposit.isDeposited ? '100%' : '0%' }} />
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-gray-400">Height</div>
                <div className="font-mono text-white">{deposit.slidePosition.toFixed(0)}mm</div>
              </div>
              <div className="bg-gray-700 rounded p-2 text-center">
                <div className="text-gray-400">State</div>
                <div className="font-mono text-green-400">{deposit.state}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Multiple Servo Indicators */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-medium mb-4">Servo Positions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ServoPositionIndicator
                position={deposit.servos?.bucket || deposit.servoPosition || 0}
                maxDegrees={360}
                label="Bucket Servo"
                size={120}
                color="#10B981"
              />
              <ServoPositionIndicator
                position={deposit.servos?.arm || 90}
                maxDegrees={360}
                label="Arm Servo"
                size={120}
                color="#8B5CF6"
              />
              <ServoPositionIndicator
                position={deposit.servos?.wrist || 45}
                maxDegrees={360}
                label="Wrist Servo"
                size={120}
                color="#EC4899"
              />
              <ServoPositionIndicator
                position={deposit.servos?.rotation || 180}
                maxDegrees={360}
                label="Rotation Servo"
                size={120}
                color="#06B6D4"
              />
            </div>
          </div>
        </div>
        
        {/* Sensor Values */}
        {deposit.sensors.length > 0 && (
          <div className="lg:col-span-2 xl:col-span-3">
            <SensorValueDisplay
              sensors={deposit.sensors}
              title="Deposit Sensors"
              columns={3}
            />
          </div>
        )}
        
        {/* PID Graph */}
        <div className="lg:col-span-2 xl:col-span-3">
          <PIDGraph
            subsystem="deposit"
            title="Deposit Slide PID Performance"
            height={300}
          />
        </div>
        
        {/* Telemetry Section */}
        <div className="lg:col-span-2 xl:col-span-3">
          <SubsystemTelemetry
            subsystemId="deposit"
            subsystemName="Deposit"
          />
        </div>
      </div>
    </div>
  );
};

export default DepositView;