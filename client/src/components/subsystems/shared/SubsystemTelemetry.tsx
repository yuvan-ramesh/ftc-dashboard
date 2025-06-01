import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { toggleTelemetryPause } from '@/store/actions/subsystems';
import TelemetryGraphManager from '@/components/views/TelemetryGraphManager';
import { ReactComponent as PlayIcon } from '@/assets/icons/play_arrow.svg';
import { ReactComponent as PauseIcon } from '@/assets/icons/pause.svg';
import { ReactComponent as RecordIcon } from '@/assets/icons/create.svg';
import { ReactComponent as RefreshIcon } from '@/assets/icons/refresh.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/file_download.svg';

interface SubsystemTelemetryProps {
  subsystemId: string;
  subsystemName: string;
}

interface TelemetryRecording {
  startTime: number;
  data: Array<{
    timestamp: number;
    values: Map<string, any>;
  }>;
}

const SubsystemTelemetry: React.FC<SubsystemTelemetryProps> = ({ subsystemId, subsystemName }) => {
  const dispatch = useDispatch();
  const telemetry = useSelector((state: RootState) => state.enhancedTelemetry);
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recordings, setRecordings] = useState<TelemetryRecording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<number>(-1);
  const [expandedValues, setExpandedValues] = useState(true);
  const recordingRef = useRef<TelemetryRecording | null>(null);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Find the section for this subsystem
  const section = telemetry.sections.find(s => s.id === subsystemId);
  
  const handlePauseToggle = () => {
    dispatch(toggleTelemetryPause());
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    recordingRef.current = {
      startTime: Date.now(),
      data: []
    };
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingRef.current && recordingRef.current.data.length > 0) {
      setRecordings([...recordings, recordingRef.current]);
      recordingRef.current = null;
    }
  };
  
  const handleStartReplay = () => {
    if (selectedRecording >= 0 && selectedRecording < recordings.length) {
      setIsReplaying(true);
      const recording = recordings[selectedRecording];
      let currentIndex = 0;
      
      replayIntervalRef.current = setInterval(() => {
        if (currentIndex < recording.data.length) {
          // Update telemetry display with replay data
          currentIndex++;
        } else {
          handleStopReplay();
        }
      }, 100);
    }
  };
  
  const handleStopReplay = () => {
    setIsReplaying(false);
    if (replayIntervalRef.current) {
      clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = null;
    }
  };
  
  const handleDownloadRecording = () => {
    if (selectedRecording >= 0 && selectedRecording < recordings.length) {
      const recording = recordings[selectedRecording];
      const blob = new Blob([JSON.stringify(recording, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subsystemId}-telemetry-${new Date(recording.startTime).toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  // Record telemetry data when recording is active
  useEffect(() => {
    if (isRecording && recordingRef.current && !telemetry.isPaused && section) {
      recordingRef.current.data.push({
        timestamp: Date.now() - recordingRef.current.startTime,
        values: new Map(section.values)
      });
    }
  }, [section, isRecording, telemetry.isPaused]);
  
  if (!section) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white text-lg font-medium mb-2">{subsystemName} Telemetry</h3>
        <p className="text-gray-400">No telemetry data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Header with controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-lg font-medium">{subsystemName} Telemetry</h3>
          <div className="flex gap-2">
            {/* Pause/Resume button */}
            <button
              onClick={handlePauseToggle}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                telemetry.isPaused
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {telemetry.isPaused ? <PlayIcon className="w-3 h-3" /> : <PauseIcon className="w-3 h-3" />}
              {telemetry.isPaused ? 'Resume' : 'Pause'}
            </button>
            
            {/* Record button */}
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              disabled={isReplaying}
            >
              <RecordIcon className="w-3 h-3" />
              {isRecording ? 'Stop' : 'Record'}
            </button>
            
            {/* Replay button */}
            {recordings.length > 0 && (
              <button
                onClick={isReplaying ? handleStopReplay : handleStartReplay}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  isReplaying
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                disabled={isRecording || selectedRecording < 0}
              >
                <RefreshIcon className="w-3 h-3" />
                {isReplaying ? 'Stop' : 'Replay'}
              </button>
            )}
          </div>
        </div>
        
        {/* Recording selector */}
        {recordings.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <select
              value={selectedRecording}
              onChange={(e) => setSelectedRecording(parseInt(e.target.value))}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRecording || isReplaying}
            >
              <option value={-1}>Select recording...</option>
              {recordings.map((recording, index) => (
                <option key={index} value={index}>
                  Recording {index + 1} - {new Date(recording.startTime).toLocaleTimeString()}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleDownloadRecording}
              className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              disabled={selectedRecording < 0}
              title="Download recording"
            >
              <DownloadIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      
      {/* Status indicators */}
      {(telemetry.isPaused || isRecording || isReplaying) && (
        <div className="space-y-1 mb-3">
          {telemetry.isPaused && (
            <div className="p-2 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded text-sm">
              <span className="text-yellow-400">⏸ Telemetry paused</span>
            </div>
          )}
          {isRecording && (
            <div className="p-2 bg-red-900 bg-opacity-20 border border-red-500 rounded text-sm">
              <span className="text-red-400">● Recording...</span>
            </div>
          )}
          {isReplaying && (
            <div className="p-2 bg-green-900 bg-opacity-20 border border-green-500 rounded text-sm">
              <span className="text-green-400">▶ Replaying...</span>
            </div>
          )}
        </div>
      )}
      
      {/* Telemetry values */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedValues(!expandedValues)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
        >
          <span className={`transform transition-transform ${expandedValues ? 'rotate-90' : ''}`}>
            ▶
          </span>
          Values ({section.values.size})
        </button>
        
        {expandedValues && section.values.size > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from(section.values.entries()).map(([key, telemetryValue]) => (
              <div
                key={key}
                className="bg-gray-700 rounded p-2 text-sm"
              >
                <div className="text-gray-400 text-xs truncate">{key}</div>
                <div className="flex items-baseline gap-1">
                  <span className={`font-mono ${
                    typeof telemetryValue.value === 'boolean'
                      ? telemetryValue.value ? 'text-green-400' : 'text-red-400'
                      : 'text-white'
                  }`}>
                    {typeof telemetryValue.value === 'boolean'
                      ? telemetryValue.value ? 'TRUE' : 'FALSE'
                      : typeof telemetryValue.value === 'number'
                      ? telemetryValue.value.toFixed(2)
                      : telemetryValue.value}
                  </span>
                  {telemetryValue.unit && (
                    <span className="text-xs text-gray-400">
                      {telemetryValue.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Graph Manager */}
      <div className="border-t border-gray-700 pt-4">
        <TelemetryGraphManager />
      </div>
    </div>
  );
};

export default SubsystemTelemetry;