import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { startOpMode, stopOpMode, initOpMode } from '@/store/actions/opmode';

const GeneralDashboardBar: React.FC = () => {
  const dispatch = useDispatch();
  const general = useSelector((state: RootState) => state.general);
  const status = useSelector((state: RootState) => state.status);
  const socketConnected = useSelector((state: RootState) => state.socket.isConnected);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (general.matchTimer.isRunning) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [general.matchTimer.isRunning]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getVoltageColor = (voltage: number) => {
    if (voltage > 12.5) return 'text-green-500';
    if (voltage > 11.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleInit = () => {
    if (status.activeOpMode) {
      dispatch(initOpMode(status.activeOpMode));
    }
  };

  const handleStart = () => {
    if (status.activeOpMode) {
      dispatch(startOpMode(status.activeOpMode));
    }
  };

  const handleStop = () => {
    dispatch(stopOpMode());
  };
  
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white">
      {/* Left Section - Match Timer and OpMode Controls */}
      <div className="flex items-center gap-6">
        {/* Match Timer */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">Match Timer</div>
          <div className={`text-2xl font-mono font-bold ${
            general.matchTimer.mode === 'AUTO' ? 'text-blue-400' :
            general.matchTimer.mode === 'TELEOP' ? 'text-green-400' :
            'text-gray-400'
          }`}>
            {formatTime(general.matchTimer.isRunning ? elapsedTime : general.matchTimer.timeRemaining)}
          </div>
          <div className="text-xs text-gray-500 uppercase">
            {general.matchTimer.mode || 'IDLE'}
          </div>
        </div>
        
        {/* OpMode Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleInit}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!socketConnected || status.activeOpModeStatus === 'RUNNING'}
          >
            Init
          </button>
          <button
            onClick={handleStart}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!socketConnected || status.activeOpModeStatus !== 'INIT'}
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!socketConnected || status.activeOpModeStatus === 'STOPPED'}
          >
            Stop
          </button>
        </div>
      </div>
      
      {/* Center Section - OpMode Status */}
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-400 mr-2">OpMode:</span>
          <span className={`font-medium ${
            status.activeOpModeStatus === 'RUNNING' ? 'text-green-400' :
            status.activeOpModeStatus === 'INIT' ? 'text-yellow-400' :
            'text-gray-400'
          }`}>
            {status.activeOpMode || 'None'} ({status.activeOpModeStatus || 'STOPPED'})
          </span>
        </div>
      </div>
      
      {/* Right Section - Power Status and Connection */}
      <div className="flex items-center gap-6">
        {/* Voltage */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Voltage:</span>
          <span className={`font-mono font-bold ${getVoltageColor(general.voltage)}`}>
            {general.voltage.toFixed(2)}V
          </span>
        </div>
        
        {/* Current */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Current:</span>
          <span className="font-mono text-amber-400">
            {general.current.toFixed(1)}A
          </span>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm ${socketConnected ? 'text-green-400' : 'text-red-400'}`}>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboardBar;