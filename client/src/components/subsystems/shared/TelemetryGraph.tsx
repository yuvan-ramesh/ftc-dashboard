import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { GraphDataPoint } from '@/store/types/subsystems';

interface TelemetryGraphProps {
  telemetryKey: string;
  title: string;
  height?: number;
  maxPoints?: number;
  yAxisLabel?: string;
  color?: string;
}

const TelemetryGraph: React.FC<TelemetryGraphProps> = ({
  telemetryKey,
  title,
  height = 200,
  maxPoints = 100,
  yAxisLabel = 'Value',
  color = '#3B82F6',
}) => {
  const [dataPoints, setDataPoints] = useState<GraphDataPoint[]>([]);
  const telemetry = useSelector((state: RootState) => state.enhancedTelemetry);
  
  useEffect(() => {
    // Find the telemetry value in sections
    for (const section of telemetry.sections) {
      const value = section.values.get(telemetryKey);
      if (value && typeof value.value === 'number') {
        setDataPoints(prev => {
          const newPoints = [...prev, {
            timestamp: value.timestamp,
            value: value.value,
          }];
          // Keep only the latest maxPoints
          return newPoints.slice(-maxPoints);
        });
        break;
      }
    }
  }, [telemetry.sections, telemetryKey, maxPoints]);
  
  // Calculate graph bounds
  const bounds = React.useMemo(() => {
    if (dataPoints.length === 0) {
      return { min: -1, max: 1, timeMin: 0, timeMax: 1 };
    }
    
    const values = dataPoints.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;
    
    const times = dataPoints.map(d => d.timestamp);
    const timeMin = Math.min(...times);
    const timeMax = Math.max(...times);
    
    return {
      min: min - padding,
      max: max + padding,
      timeMin,
      timeMax,
    };
  }, [dataPoints]);
  
  // Convert data points to SVG path
  const path = React.useMemo(() => {
    if (dataPoints.length === 0) return '';
    
    const { min, max, timeMin, timeMax } = bounds;
    const valueRange = max - min;
    const timeRange = timeMax - timeMin || 1;
    
    const points = dataPoints.map((point, index) => {
      const x = ((point.timestamp - timeMin) / timeRange) * 100;
      const y = (1 - (point.value - min) / valueRange) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    });
    
    return points.join(' ');
  }, [dataPoints, bounds]);
  
  const currentValue = dataPoints[dataPoints.length - 1]?.value;
  
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-medium">{title}</h3>
        {currentValue !== undefined && (
          <span className="text-lg font-mono" style={{ color }}>
            {currentValue.toFixed(2)}
          </span>
        )}
      </div>
      
      <div className="relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${telemetryKey}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${telemetryKey})`} />
          
          {/* Zero line if visible */}
          {bounds.min < 0 && bounds.max > 0 && (
            <line
              x1="0"
              y1={`${(1 - (0 - bounds.min) / (bounds.max - bounds.min)) * 100}`}
              x2="100"
              y2={`${(1 - (0 - bounds.min) / (bounds.max - bounds.min)) * 100}`}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          )}
          
          {/* Data line */}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Current value dot */}
          {dataPoints.length > 0 && (
            <circle
              cx="100"
              cy={`${(1 - (currentValue! - bounds.min) / (bounds.max - bounds.min)) * 100}`}
              r="3"
              fill={color}
            />
          )}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          <span>{bounds.max.toFixed(1)}</span>
          <span>{((bounds.max + bounds.min) / 2).toFixed(1)}</span>
          <span>{bounds.min.toFixed(1)}</span>
        </div>
        
        {/* Y-axis label */}
        <div className="absolute -left-16 top-1/2 transform -rotate-90 origin-center text-xs text-gray-500">
          {yAxisLabel}
        </div>
      </div>
      
      {/* X-axis label */}
      <div className="text-center text-xs text-gray-500 mt-1">Time</div>
    </div>
  );
};

export default TelemetryGraph;