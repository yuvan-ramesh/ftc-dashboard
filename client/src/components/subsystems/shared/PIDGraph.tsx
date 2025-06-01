import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { GraphDataPoint } from '@/store/types/subsystems';

interface PIDGraphProps {
  subsystem: string;
  title?: string;
  height?: number;
  showSetpoint?: boolean;
  showError?: boolean;
  showOutput?: boolean;
}

const PIDGraph: React.FC<PIDGraphProps> = ({
  subsystem,
  title = 'PID Performance',
  height = 300,
  showSetpoint = true,
  showError = true,
  showOutput = true,
}) => {
  const graphData = useSelector((state: RootState) => state.graphs.data);
  
  const setpointData = graphData[`${subsystem}-pid-setpoint`] || [];
  const actualData = graphData[`${subsystem}-pid-actual`] || [];
  const errorData = graphData[`${subsystem}-pid-error`] || [];
  const outputData = graphData[`${subsystem}-pid-output`] || [];
  
  // Calculate graph bounds
  const bounds = useMemo(() => {
    const allData = [
      ...setpointData.map(d => d.value),
      ...actualData.map(d => d.value),
      ...errorData.map(d => d.value),
      ...outputData.map(d => d.value),
    ];
    
    if (allData.length === 0) {
      return { min: -1, max: 1, timeMin: 0, timeMax: 1 };
    }
    
    const min = Math.min(...allData);
    const max = Math.max(...allData);
    const padding = (max - min) * 0.1 || 1;
    
    const times = [
      ...setpointData.map(d => d.timestamp),
      ...actualData.map(d => d.timestamp),
    ];
    const timeMin = Math.min(...times);
    const timeMax = Math.max(...times);
    
    return {
      min: min - padding,
      max: max + padding,
      timeMin,
      timeMax,
    };
  }, [setpointData, actualData, errorData, outputData]);
  
  // Convert data points to SVG path
  const dataToPath = (data: GraphDataPoint[]) => {
    if (data.length === 0) return '';
    
    const { min, max, timeMin, timeMax } = bounds;
    const valueRange = max - min;
    const timeRange = timeMax - timeMin || 1;
    
    const points = data.map((point, index) => {
      const x = ((point.timestamp - timeMin) / timeRange) * 100;
      const y = (1 - (point.value - min) / valueRange) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    });
    
    return points.join(' ');
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
      
      <div className="relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Zero line if visible */}
          {bounds.min < 0 && bounds.max > 0 && (
            <line
              x1="0"
              y1={`${(1 - (0 - bounds.min) / (bounds.max - bounds.min)) * 100}`}
              x2="100"
              y2={`${(1 - (0 - bounds.min) / (bounds.max - bounds.min)) * 100}`}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          )}
          
          {/* Data lines */}
          {showSetpoint && (
            <path
              d={dataToPath(setpointData)}
              fill="none"
              stroke="#10B981" // Green for setpoint
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          )}
          
          <path
            d={dataToPath(actualData)}
            fill="none"
            stroke="#3B82F6" // Blue for actual
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {showError && (
            <path
              d={dataToPath(errorData)}
              fill="none"
              stroke="#EF4444" // Red for error
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
          
          {showOutput && (
            <path
              d={dataToPath(outputData)}
              fill="none"
              stroke="#F59E0B" // Amber for output
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
          <span>{bounds.max.toFixed(1)}</span>
          <span>{((bounds.max + bounds.min) / 2).toFixed(1)}</span>
          <span>{bounds.min.toFixed(1)}</span>
        </div>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-90 rounded p-2 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-300">Actual</span>
          </div>
          {showSetpoint && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-300">Setpoint</span>
            </div>
          )}
          {showError && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-gray-300">Error</span>
            </div>
          )}
          {showOutput && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-amber-500"></div>
              <span className="text-gray-300">Output</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Current values */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div className="bg-gray-800 rounded p-2">
          <div className="text-gray-400">Actual</div>
          <div className="text-blue-400 font-mono">
            {actualData[actualData.length - 1]?.value.toFixed(2) || '0.00'}
          </div>
        </div>
        {showSetpoint && (
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400">Setpoint</div>
            <div className="text-green-400 font-mono">
              {setpointData[setpointData.length - 1]?.value.toFixed(2) || '0.00'}
            </div>
          </div>
        )}
        {showError && (
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400">Error</div>
            <div className="text-red-400 font-mono">
              {errorData[errorData.length - 1]?.value.toFixed(2) || '0.00'}
            </div>
          </div>
        )}
        {showOutput && (
          <div className="bg-gray-800 rounded p-2">
            <div className="text-gray-400">Output</div>
            <div className="text-amber-400 font-mono">
              {outputData[outputData.length - 1]?.value.toFixed(2) || '0.00'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PIDGraph;