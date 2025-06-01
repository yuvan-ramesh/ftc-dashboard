import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { toggleTelemetryPause, addGraph, createGraphConfig } from '@/store/actions/subsystems';
import BaseView from './BaseView';
import { ReactComponent as PlayIcon } from '@/assets/icons/play_arrow.svg';
import { ReactComponent as PauseIcon } from '@/assets/icons/pause.svg';
import { ReactComponent as RecordIcon } from '@/assets/icons/create.svg';
import { ReactComponent as RefreshIcon } from '@/assets/icons/refresh.svg';
import { ReactComponent as DownloadIcon } from '@/assets/icons/file_download.svg';
import TelemetryGraphManager from './TelemetryGraphManager';

interface TelemetryRecording {
  startTime: number;
  data: Array<{
    timestamp: number;
    sections: any[];
  }>;
}

const EnhancedTelemetryView: React.FC = () => {
  const telemetry = useSelector((state: RootState) => state.enhancedTelemetry);
  const dispatch = useDispatch();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [recordings, setRecordings] = useState<TelemetryRecording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<number>(-1);
  const recordingRef = useRef<TelemetryRecording | null>(null);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };
  
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
          // Dispatch replay data to telemetry
          // This would need a new action to update telemetry with replay data
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
      a.download = `telemetry-recording-${new Date(recording.startTime).toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  
  // Record telemetry data when recording is active
  useEffect(() => {
    if (isRecording && recordingRef.current && !telemetry.isPaused) {
      recordingRef.current.data.push({
        timestamp: Date.now() - recordingRef.current.startTime,
        sections: telemetry.sections.map(section => ({
          id: section.id,
          name: section.name,
          values: Array.from(section.values.entries())
        }))
      });
    }
  }, [telemetry.sections, isRecording, telemetry.isPaused]);
  
  const handleCreateGraph = (sectionId: string, key: string, value: any) => {
    if (typeof value === 'number') {
      const config = createGraphConfig(
        `${sectionId} - ${key}`,
        `${sectionId}.${key}`,
        sectionId
      );
      dispatch(addGraph(config));
    }
  };
  
  return (
    <BaseView>
      {/* Header with controls */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-white">Enhanced Telemetry</h2>
          <div className="flex gap-2">
            {/* Pause/Resume button */}
            <button
              onClick={handlePauseToggle}
              className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                telemetry.isPaused
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {telemetry.isPaused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
              {telemetry.isPaused ? 'Resume' : 'Pause'}
            </button>
            
            {/* Record button */}
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              disabled={isReplaying}
            >
              <RecordIcon className="w-4 h-4" />
              {isRecording ? 'Stop Recording' : 'Record'}
            </button>
            
            {/* Replay button */}
            <button
              onClick={isReplaying ? handleStopReplay : handleStartReplay}
              className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isReplaying
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              disabled={isRecording || selectedRecording < 0}
            >
              <RefreshIcon className="w-4 h-4" />
              {isReplaying ? 'Stop Replay' : 'Replay'}
            </button>
          </div>
        </div>
        
        {/* Recording selector */}
        {recordings.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={selectedRecording}
              onChange={(e) => setSelectedRecording(parseInt(e.target.value))}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRecording || isReplaying}
            >
              <option value={-1}>Select a recording...</option>
              {recordings.map((recording, index) => (
                <option key={index} value={index}>
                  Recording {index + 1} - {new Date(recording.startTime).toLocaleTimeString()}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleDownloadRecording}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={selectedRecording < 0}
              title="Download recording"
            >
              <DownloadIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* Status indicators */}
      <div className="space-y-2 mb-4">
        {telemetry.isPaused && (
          <div className="p-3 bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400">
                Telemetry paused - {telemetry.buffer.length} updates buffered
              </span>
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400">
                Recording telemetry data...
              </span>
            </div>
          </div>
        )}
        
        {isReplaying && (
          <div className="p-3 bg-green-900 bg-opacity-20 border border-green-500 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">
                Replaying recording...
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Telemetry sections */}
      <div className="space-y-4">
        {telemetry.sections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const hasValues = section.values.size > 0;
          
          return (
            <div key={section.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                  <h3 className="text-lg font-medium text-white">{section.name}</h3>
                  <span className="text-sm text-gray-400">
                    ({section.values.size} values)
                  </span>
                </div>
                
                {!hasValues && (
                  <span className="text-sm text-gray-500">No data</span>
                )}
              </button>
              
              {/* Section content */}
              {isExpanded && hasValues && (
                <div className="border-t border-gray-700 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from(section.values.entries()).map(([key, telemetryValue]) => (
                      <div
                        key={key}
                        className="bg-gray-700 rounded-lg p-3 group hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-400 truncate">{key}</div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className={`font-mono text-lg ${
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
                                <span className="text-sm text-gray-400">
                                  {telemetryValue.unit}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Graph button for numeric values */}
                          {typeof telemetryValue.value === 'number' && (
                            <button
                              onClick={() => handleCreateGraph(section.id, key, telemetryValue.value)}
                              className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-500 transition-all"
                              title="Create graph"
                            >
                              📊
                            </button>
                          )}
                        </div>
                        
                        {/* Timestamp */}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(telemetryValue.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Telemetry Graph Manager */}
      <div className="mt-6">
        <TelemetryGraphManager />
      </div>
    </BaseView>
  );
};

export default EnhancedTelemetryView;