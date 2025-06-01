import React from 'react';

interface EncoderValuesProps {
  encoders: {
    leftFront: number;
    rightFront: number;
    leftBack: number;
    rightBack: number;
  };
}

const EncoderValues: React.FC<EncoderValuesProps> = ({ encoders }) => {
  // Calculate average values
  const leftAverage = (encoders.leftFront + encoders.leftBack) / 2;
  const rightAverage = (encoders.rightFront + encoders.rightBack) / 2;
  const totalAverage = (encoders.leftFront + encoders.rightFront + encoders.leftBack + encoders.rightBack) / 4;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white text-lg font-medium mb-4">Encoder Values</h3>
      
      {/* Visual robot layout */}
      <div className="relative bg-gray-900 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Front */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Left Front</div>
            <div className="font-mono text-lg text-blue-400">
              {encoders.leftFront.toFixed(0)}
            </div>
          </div>
          
          {/* Right Front */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Right Front</div>
            <div className="font-mono text-lg text-green-400">
              {encoders.rightFront.toFixed(0)}
            </div>
          </div>
          
          {/* Robot body visualization */}
          <div className="col-span-2 flex justify-center my-2">
            <div className="w-32 h-20 bg-gray-700 rounded-lg relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-500">ROBOT</span>
              </div>
              {/* Direction indicator */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-amber-400"></div>
              </div>
            </div>
          </div>
          
          {/* Left Back */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Left Back</div>
            <div className="font-mono text-lg text-blue-400">
              {encoders.leftBack.toFixed(0)}
            </div>
          </div>
          
          {/* Right Back */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">Right Back</div>
            <div className="font-mono text-lg text-green-400">
              {encoders.rightBack.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Calculated values */}
      <div className="space-y-2">
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-400">Left Average:</span>
          <span className="font-mono text-blue-400">{leftAverage.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-400">Right Average:</span>
          <span className="font-mono text-green-400">{rightAverage.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-gray-700 pt-2">
          <span className="text-sm text-gray-400">Total Average:</span>
          <span className="font-mono text-white">{totalAverage.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-sm text-gray-400">Left-Right Diff:</span>
          <span className={`font-mono ${Math.abs(leftAverage - rightAverage) > 100 ? 'text-red-400' : 'text-gray-300'}`}>
            {Math.abs(leftAverage - rightAverage).toFixed(1)}
          </span>
        </div>
      </div>
      
      {/* Units note */}
      <div className="mt-3 text-xs text-gray-500">
        * Encoder ticks
      </div>
    </div>
  );
};

export default EncoderValues;