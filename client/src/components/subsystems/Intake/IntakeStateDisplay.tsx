import React from 'react';
import { IntakeState } from '@/store/types/subsystems';

interface IntakeStateDisplayProps {
  state: IntakeState['state'];
  slidePosition: number;
  slideTarget: number;
}

const IntakeStateDisplay: React.FC<IntakeStateDisplayProps> = ({
  state,
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
      icon: '→',
      description: 'Extending slide',
    },
    RETRACTING: {
      color: 'text-green-400',
      bgColor: 'bg-green-900 bg-opacity-20',
      icon: '←',
      description: 'Retracting slide',
    },
    GRABBING: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-900 bg-opacity-20',
      icon: '✊',
      description: 'Grabbing sample',
    },
    RELEASING: {
      color: 'text-purple-400',
      bgColor: 'bg-purple-900 bg-opacity-20',
      icon: '✋',
      description: 'Releasing sample',
    },
  }[state];
  
  const progress = slideTarget !== 0 ? (slidePosition / slideTarget) * 100 : 0;
  const isAtTarget = Math.abs(slidePosition - slideTarget) < 5; // 5mm tolerance
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Intake State</h3>
      
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
      
      {/* Position tracking */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Current Position</span>
          <span className="font-mono text-white">{slidePosition.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Target Position</span>
          <span className="font-mono text-white">{slideTarget.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Distance to Target</span>
          <span className={`font-mono ${isAtTarget ? 'text-green-400' : 'text-yellow-400'}`}>
            {Math.abs(slidePosition - slideTarget).toFixed(1)} mm
          </span>
        </div>
      </div>
      
      {/* State machine visualization */}
      <div className="mt-4 bg-gray-900 rounded-lg p-3">
        <div className="text-xs text-gray-500 mb-2">State Flow</div>
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded ${state === 'IDLE' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}>
            IDLE
          </div>
          <span className="text-gray-600">→</span>
          <div className={`px-2 py-1 rounded ${state === 'EXTENDING' ? 'bg-blue-800 text-white' : 'text-gray-500'}`}>
            EXTEND
          </div>
          <span className="text-gray-600">→</span>
          <div className={`px-2 py-1 rounded ${state === 'GRABBING' ? 'bg-amber-800 text-white' : 'text-gray-500'}`}>
            GRAB
          </div>
          <span className="text-gray-600">→</span>
          <div className={`px-2 py-1 rounded ${state === 'RETRACTING' ? 'bg-green-800 text-white' : 'text-gray-500'}`}>
            RETRACT
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeStateDisplay;