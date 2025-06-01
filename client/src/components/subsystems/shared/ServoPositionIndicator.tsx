import React from 'react';

interface ServoPositionIndicatorProps {
  position: number; // 0-1 or 0-360 degrees
  maxDegrees?: number; // Maximum rotation in degrees (default 180)
  label?: string;
  size?: number; // Size in pixels
  color?: string;
}

const ServoPositionIndicator: React.FC<ServoPositionIndicatorProps> = ({
  position,
  maxDegrees = 180,
  label = 'Servo Position',
  size = 150,
  color = '#3B82F6',
}) => {
  // Convert position to degrees
  const degrees = position <= 1 ? position * maxDegrees : position;
  const normalizedPosition = degrees / maxDegrees;
  
  // Calculate rotation angle for the indicator
  const rotationAngle = (degrees - maxDegrees / 2) * (Math.PI / 180);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  const indicatorLength = radius * 0.8;
  
  // Calculate arc path
  const startAngle = -maxDegrees / 2 * (Math.PI / 180);
  const endAngle = maxDegrees / 2 * (Math.PI / 180);
  
  const arcStartX = centerX + radius * Math.cos(startAngle);
  const arcStartY = centerY + radius * Math.sin(startAngle);
  const arcEndX = centerX + radius * Math.cos(endAngle);
  const arcEndY = centerY + radius * Math.sin(endAngle);
  
  const largeArcFlag = maxDegrees > 180 ? 1 : 0;
  
  const arcPath = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}`;
  
  // Calculate indicator position
  const indicatorEndX = centerX + indicatorLength * Math.cos(rotationAngle);
  const indicatorEndY = centerY + indicatorLength * Math.sin(rotationAngle);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">{label}</h3>
      
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0"
        >
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 10}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          
          {/* Arc showing range of motion */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Active arc */}
          <path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${normalizedPosition * radius * Math.PI * (maxDegrees / 180)} ${radius * Math.PI * (maxDegrees / 180)}`}
            opacity="0.5"
          />
          
          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="5"
            fill={color}
          />
          
          {/* Position indicator */}
          <line
            x1={centerX}
            y1={centerY}
            x2={indicatorEndX}
            y2={indicatorEndY}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Indicator tip */}
          <circle
            cx={indicatorEndX}
            cy={indicatorEndY}
            r="6"
            fill={color}
          />
          
          {/* Tick marks */}
          {[0, 45, 90, 135, 180].map((angle) => {
            if (angle > maxDegrees) return null;
            const tickAngle = (angle - maxDegrees / 2) * (Math.PI / 180);
            const tickStartRadius = radius - 5;
            const tickEndRadius = radius + 5;
            const x1 = centerX + tickStartRadius * Math.cos(tickAngle);
            const y1 = centerY + tickStartRadius * Math.sin(tickAngle);
            const x2 = centerX + tickEndRadius * Math.cos(tickAngle);
            const y2 = centerY + tickEndRadius * Math.sin(tickAngle);
            
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Angle labels */}
          <text
            x={arcStartX - 10}
            y={arcStartY + 5}
            fill="rgba(255, 255, 255, 0.5)"
            fontSize="12"
            textAnchor="end"
          >
            0°
          </text>
          <text
            x={arcEndX + 10}
            y={arcEndY + 5}
            fill="rgba(255, 255, 255, 0.5)"
            fontSize="12"
            textAnchor="start"
          >
            {maxDegrees}°
          </text>
        </svg>
      </div>
      
      {/* Current position display */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-mono font-bold" style={{ color }}>
          {degrees.toFixed(1)}°
        </div>
        <div className="text-sm text-gray-400">
          {(normalizedPosition * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default ServoPositionIndicator;