import React from 'react';
import { SensorData } from '@/store/types/subsystems';

interface SensorValueDisplayProps {
  sensors: SensorData[];
  title?: string;
  columns?: number;
}

const SensorValueDisplay: React.FC<SensorValueDisplayProps> = ({
  sensors,
  title = 'Sensor Values',
  columns = 2,
}) => {
  if (sensors.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">{title}</h4>
        <p className="text-gray-500 text-sm">No sensor data available</p>
      </div>
    );
  }
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-2';
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h4 className="text-white font-medium mb-3">{title}</h4>
      
      <div className={`grid ${gridCols} gap-3`}>
        {sensors.map((sensor, index) => (
          <div
            key={`${sensor.name}-${index}`}
            className="bg-gray-700 rounded px-3 py-2"
          >
            <div className="text-xs text-gray-400 mb-1">{sensor.name}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-mono text-white">
                {typeof sensor.value === 'number' 
                  ? sensor.value.toFixed(2)
                  : sensor.value}
              </span>
              {sensor.unit && (
                <span className="text-sm text-gray-400">{sensor.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorValueDisplay;