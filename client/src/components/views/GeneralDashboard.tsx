import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import BaseView from './BaseView';

const GeneralDashboard: React.FC = () => {
  const general = useSelector((state: RootState) => state.general);
  const opModeStatus = useSelector((state: RootState) => state.status.opModeStatus);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (general.matchTimer.isRunning) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [general.matchTimer.isRunning]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getBatteryColor = (percentage: number) => {
    if (percentage > 60) return 'text-green-400';
    if (percentage > 30) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getVoltageColor = (voltage: number) => {
    if (voltage > 12.5) return 'text-green-400';
    if (voltage > 11.5) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <BaseView>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Match Timer */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">Match Timer</h3>
          
          <div className="text-center">
            {/* Timer display */}
            <div className="mb-4">
              <div className={`text-5xl font-mono font-bold ${
                general.matchTimer.mode === 'AUTO' ? 'text-blue-400' :
                general.matchTimer.mode === 'TELEOP' ? 'text-green-400' :
                'text-gray-400'
              }`}>
                {formatTime(general.matchTimer.timeRemaining)}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {general.matchTimer.mode}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-1000 ${
                  general.matchTimer.mode === 'AUTO' ? 'bg-blue-500' :
                  general.matchTimer.mode === 'TELEOP' ? 'bg-green-500' :
                  'bg-gray-600'
                }`}
                style={{
                  width: `${((general.matchTimer.totalTime - general.matchTimer.timeRemaining) / general.matchTimer.totalTime) * 100}%`
                }}
              />
            </div>
            
            {/* Match phase indicators */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>{general.matchTimer.mode === 'AUTO' ? '0:30' : '2:30'}</span>
            </div>
          </div>
          
          {/* OpMode controls */}
          <div className="mt-6 flex gap-2">
            <button
              className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
              disabled={opModeStatus === 'RUNNING'}
            >
              Init
            </button>
            <button
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
              disabled={opModeStatus === 'RUNNING'}
            >
              Start
            </button>
            <button
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
              disabled={opModeStatus === 'STOPPED'}
            >
              Stop
            </button>
          </div>
        </div>
        
        {/* Voltage Monitor */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">Power Status</h3>
          
          {/* Voltage display */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-gray-400">Voltage</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-mono font-bold ${getVoltageColor(general.voltage)}`}>
                  {general.voltage.toFixed(2)}
                </span>
                <span className="text-gray-400">V</span>
              </div>
            </div>
            
            {/* Voltage bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  general.voltage > 12.5 ? 'bg-green-500' :
                  general.voltage > 11.5 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(general.voltage / 14) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10V</span>
              <span>14V</span>
            </div>
          </div>
          
          {/* Current display */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-gray-400">Current</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono text-amber-400">
                  {general.current.toFixed(1)}
                </span>
                <span className="text-gray-400">A</span>
              </div>
            </div>
          </div>
          
          {/* Battery percentage */}
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Battery</span>
              <span className={`text-lg font-bold ${getBatteryColor(general.batteryPercentage)}`}>
                {general.batteryPercentage}%
              </span>
            </div>
            <div className="mt-2 h-4 bg-gray-600 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  general.batteryPercentage > 60 ? 'bg-green-500' :
                  general.batteryPercentage > 30 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${general.batteryPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white text-lg font-medium mb-4">System Status</h3>
          
          <div className="space-y-3">
            {/* OpMode status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">OpMode</span>
              <span className={`font-medium ${
                opModeStatus === 'RUNNING' ? 'text-green-400' :
                opModeStatus === 'INIT' ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {opModeStatus || 'STOPPED'}
              </span>
            </div>
            
            {/* Connection status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Connection</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Connected</span>
              </div>
            </div>
            
            {/* Power warnings */}
            {general.voltage < 11.5 && (
              <div className="mt-4 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-sm text-red-400">Low battery voltage!</span>
                </div>
              </div>
            )}
            
            {general.current > 20 && (
              <div className="mt-4 p-3 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-sm text-yellow-400">High current draw!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseView>
  );
};

export default GeneralDashboard;