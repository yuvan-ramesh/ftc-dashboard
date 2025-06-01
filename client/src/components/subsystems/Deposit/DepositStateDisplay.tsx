import React from 'react';
import { DepositState } from '@/store/types/subsystems';

interface DepositStateDisplayProps {
  state: DepositState['state'];
  isDeposited: boolean;
  slidePosition: number;
  slideTarget: number;
}

const DepositStateDisplay: React.FC<DepositStateDisplayProps> = ({
  state,
  isDeposited,
  slidePosition,
  slideTarget,
}) => {
  const stateConfig = {
    IDLE: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-700',
      icon: '⏸',
      description: 'System idle',
    },
    EXTENDING: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-900 bg-opacity-20',
      icon: '↑',
      description: 'Raising to deposit height',
    },
    RETRACTING: {
      color: 'text-green-400',
      bgColor: 'bg-green-900 bg-opacity-20',
      icon: '↓',
      description: 'Lowering slide',
    },
    DEPOSITING: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-900 bg-opacity-20',
      icon: '📤',
      description: 'Depositing sample',
    },
    RESETTING: {
      color: 'text-purple-400',
      bgColor: 'bg-purple-900 bg-opacity-20',
      icon: '🔄',
      description: 'Resetting to home',
    },
  }[state];
  
  const progress = slideTarget !== 0 ? (slidePosition / slideTarget) * 100 : 0;
  const isAtTarget = Math.abs(slidePosition - slideTarget) < 5; // 5mm tolerance
  
  // Determine deposit zones based on slide height
  const depositZones = [
    { name: 'Ground', min: 0, max: 100, color: 'bg-gray-600' },
    { name: 'Low', min: 100, max: 300, color: 'bg-blue-600' },
    { name: 'Medium', min: 300, max: 500, color: 'bg-yellow-600' },
    { name: 'High', min: 500, max: 800, color: 'bg-red-600' },
  ];
  
  const currentZone = depositZones.find(
    zone => slidePosition >= zone.min && slidePosition <= zone.max
  ) || depositZones[0];
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Deposit State</h3>
      
      {/* Current state display */}
      <div className={`rounded-lg p-4 mb-4 ${stateConfig.bgColor}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stateConfig.icon}</span>
            <div>
              <div className={`text-lg font-medium ${stateConfig.color}`}>
                {state}
              </div>
              <div className="text-xs text-gray-400">
                {stateConfig.description}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator for movement states */}
        {(state === 'EXTENDING' || state === 'RETRACTING') && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  state === 'EXTENDING' ? 'bg-blue-500' : 'bg-green-500'
                } transition-all duration-300`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Deposit zone indicator */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Deposit Zone</div>
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-lg font-medium ${currentZone.color.replace('bg-', 'text-')}`}>
              {currentZone.name} Zone
            </span>
            <span className="text-sm text-gray-400">
              {slidePosition.toFixed(0)}mm
            </span>
          </div>
          
          {/* Visual height indicator */}
          <div className="relative h-32 bg-gray-700 rounded overflow-hidden">
            {depositZones.reverse().map((zone, index) => (
              <div
                key={zone.name}
                className={`absolute left-0 right-0 ${zone.color} opacity-30`}
                style={{
                  bottom: `${(zone.min / 800) * 100}%`,
                  height: `${((zone.max - zone.min) / 800) * 100}%`,
                }}
              >
                <div className="absolute top-2 left-2 text-xs text-white opacity-70">
                  {zone.name}
                </div>
              </div>
            ))}
            
            {/* Current position indicator */}
            <div
              className="absolute left-0 right-0 h-1 bg-white shadow-lg transition-all duration-300"
              style={{ bottom: `${(slidePosition / 800) * 100}%` }}
            >
              <div className="absolute -top-3 right-2 text-xs text-white bg-gray-800 px-1 rounded">
                {slidePosition.toFixed(0)}mm
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* State machine status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Position Status</span>
          <span className={`text-sm font-medium ${isAtTarget ? 'text-green-400' : 'text-yellow-400'}`}>
            {isAtTarget ? 'At Target' : 'Moving'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Deposit Status</span>
          <span className={`text-sm font-medium ${isDeposited ? 'text-green-400' : 'text-gray-400'}`}>
            {isDeposited ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepositStateDisplay;