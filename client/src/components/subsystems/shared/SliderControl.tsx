import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

interface SliderControlProps {
  label: string;
  value: number;
  target: number;
  min: number;
  max: number;
  unit?: string;
  onTargetChange: (value: number) => void;
  showQuickButtons?: boolean;
  quickButtonValues?: number[];
  color?: string;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  target,
  min,
  max,
  unit = '',
  onTargetChange,
  showQuickButtons = true,
  quickButtonValues,
  color = 'blue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();
  
  const defaultQuickValues = quickButtonValues || [
    min,
    min + (max - min) * 0.25,
    min + (max - min) * 0.5,
    min + (max - min) * 0.75,
    max,
  ];
  
  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onTargetChange(newValue);
  }, [onTargetChange]);
  
  const handleQuickSet = useCallback((quickValue: number) => {
    onTargetChange(quickValue);
  }, [onTargetChange]);
  
  // Calculate positions for visual indicators
  const valuePercent = ((value - min) / (max - min)) * 100;
  const targetPercent = ((target - min) / (max - min)) * 100;
  
  const colorClasses = {
    blue: {
      slider: 'bg-blue-600',
      value: 'bg-blue-400',
      target: 'border-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-400',
    },
    green: {
      slider: 'bg-green-600',
      value: 'bg-green-400',
      target: 'border-green-500',
      button: 'bg-green-600 hover:bg-green-700',
      text: 'text-green-400',
    },
    amber: {
      slider: 'bg-amber-600',
      value: 'bg-amber-400',
      target: 'border-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700',
      text: 'text-amber-400',
    },
  }[color] || colorClasses.blue;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white font-medium">{label}</h4>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-400">
            Current: <span className={`font-mono ${colorClasses.text}`}>
              {value.toFixed(1)}{unit}
            </span>
          </span>
          <span className="text-gray-400">
            Target: <span className={`font-mono ${colorClasses.text}`}>
              {target.toFixed(1)}{unit}
            </span>
          </span>
        </div>
      </div>
      
      {/* Visual slider with current and target indicators */}
      <div className="relative h-12 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-gray-700 rounded-full relative">
            {/* Current value indicator */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${colorClasses.value} rounded-full shadow-lg transition-all duration-300`}
              style={{ left: `calc(${valuePercent}% - 8px)` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                {value.toFixed(1)}
              </div>
            </div>
            
            {/* Target value indicator */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 border-2 ${colorClasses.target} rounded-full transition-all duration-150`}
              style={{ left: `calc(${targetPercent}% - 8px)` }}
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                {target.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Control slider */}
      <div className="relative mb-4">
        <input
          type="range"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={target}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb-${color}`}
          style={{
            background: `linear-gradient(to right, ${colorClasses.slider} 0%, ${colorClasses.slider} ${targetPercent}%, #374151 ${targetPercent}%, #374151 100%)`,
          }}
        />
        
        {/* Min/Max labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
      
      {/* Quick set buttons */}
      {showQuickButtons && (
        <div className="flex gap-2">
          {defaultQuickValues.map((quickValue, index) => (
            <button
              key={index}
              onClick={() => handleQuickSet(quickValue)}
              className={`flex-1 py-1 px-2 text-sm text-white rounded ${colorClasses.button} transition-colors`}
            >
              {quickValue.toFixed(0)}{unit}
            </button>
          ))}
        </div>
      )}
      
      {/* Manual input */}
      <div className="mt-3 flex items-center gap-2">
        <label className="text-sm text-gray-400">Manual:</label>
        <input
          type="number"
          min={min}
          max={max}
          step={(max - min) / 100}
          value={target}
          onChange={(e) => onTargetChange(parseFloat(e.target.value) || 0)}
          className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono"
        />
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
      
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: none;
        }
        
        .slider-thumb-blue::-webkit-slider-thumb {
          border: 2px solid #3B82F6;
        }
        
        .slider-thumb-green::-webkit-slider-thumb {
          border: 2px solid #10B981;
        }
        
        .slider-thumb-amber::-webkit-slider-thumb {
          border: 2px solid #F59E0B;
        }
      `}</style>
    </div>
  );
};

export default SliderControl;