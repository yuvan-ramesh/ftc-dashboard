import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import BaseView from './BaseView';

interface CameraFeedViewProps {
  isUnlocked?: boolean;
  isDraggable?: boolean;
}

const CameraFeedView: React.FC<CameraFeedViewProps> = ({ isUnlocked, isDraggable }) => {
  const cameraState = useSelector((state: RootState) => state.subsystems.camera);
  const cameraUrl = useSelector((state: RootState) => state.settings.cameraUrl || '/api/camera/stream');
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Camera System</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Camera Feed */}
        <div className="lg:col-span-1">
          <BaseView isUnlocked={isUnlocked}>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white text-lg font-medium mb-4">Camera Feed</h3>
              
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={cameraUrl}
                    alt="Camera Feed"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-message')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message text-gray-500 text-center';
                        errorDiv.innerHTML = `
                          <div class="mb-2">
                            <svg class="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </div>
                          <p>Camera feed unavailable</p>
                          <p class="text-sm text-gray-600 mt-1">Check camera connection</p>
                        `;
                        parent.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Camera Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">Resolution</div>
                  <div className="text-white font-mono">
                    {cameraState.resolution.width}x{cameraState.resolution.height}
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">FPS</div>
                  <div className="text-white font-mono">{cameraState.frameRate}</div>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">Processing</div>
                  <div className="text-white font-mono">{cameraState.processingTime}ms</div>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <div className="text-gray-400">Objects</div>
                  <div className="text-white font-mono">{cameraState.detectedObjects.length}</div>
                </div>
              </div>
            </div>
          </BaseView>
        </div>
        
        {/* Detected Objects */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-white text-lg font-medium mb-4">Detected Objects</h3>
            
            {/* Detection Summary */}
            {cameraState.detectedObjects.length > 0 && (
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Objects:</span>
                    <span className="text-white font-bold">{cameraState.detectedObjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Colors Detected:</span>
                    <span className="text-white">
                      {Array.from(new Set(cameraState.detectedObjects.map(obj => {
                        const color = obj.color.toLowerCase();
                        if (color.includes('blue')) return 'Blue';
                        if (color.includes('red')) return 'Red';
                        if (color.includes('yellow')) return 'Yellow';
                        return 'Other';
                      }))).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {cameraState.detectedObjects.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cameraState.detectedObjects.map((obj) => (
                  <div key={obj.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-white">{obj.type}</div>
                        <div className="text-sm text-gray-400">ID: {obj.id}</div>
                      </div>
                      <div
                        className="w-6 h-6 rounded border-2 border-gray-600"
                        style={{ backgroundColor: obj.color }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Position:</span>
                        <span className="ml-1 text-white font-mono">
                          ({obj.x}, {obj.y})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Size:</span>
                        <span className="ml-1 text-white font-mono">
                          {obj.width}x{obj.height}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="ml-1 text-white font-mono">
                          {(obj.confidence * 100).toFixed(1)}%
                        </span>
                        <div className="mt-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${obj.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No objects detected</p>
              </div>
            )}
            
            {/* Detection Legend */}
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Object Colors:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span className="text-gray-300">Blue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-gray-300">Red</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span className="text-gray-300">Yellow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-400"></div>
                  <span className="text-gray-300">Other</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraFeedView;