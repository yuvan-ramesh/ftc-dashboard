import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/reducers';
import { toggleTelemetryPause, addGraph, createGraphConfig } from '@/store/actions/subsystems';
import BaseView from './BaseView';

const EnhancedTelemetryView: React.FC = () => {
  const telemetry = useSelector((state: RootState) => state.enhancedTelemetry);
  const dispatch = useDispatch();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
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
      {/* Header with pause control */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Enhanced Telemetry</h2>
        <button
          onClick={handlePauseToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            telemetry.isPaused
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {telemetry.isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>
      
      {/* Paused indicator */}
      {telemetry.isPaused && (
        <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400">
              Telemetry paused - {telemetry.buffer.length} updates buffered
            </span>
          </div>
        </div>
      )}
      
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
      
      {/* Graphable values indicator */}
      {telemetry.graphableValues.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">
            💡 {telemetry.graphableValues.length} numeric values available for graphing
          </div>
        </div>
      )}
    </BaseView>
  );
};

export default EnhancedTelemetryView;