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
      
      {/* Top section with camera feed and color indicator */}
      <div className="flex gap-4">
        {/* Camera Feed - Now takes more horizontal space */}
        <div className="flex-1">
          <BaseView isUnlocked={isUnlocked}>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white text-lg font-medium mb-4">Camera Feed</h3>
              
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
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
              <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
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
        
        {/* Color Detection Indicator - Bigger circle */}
        <div className="w-48">
          <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col items-center justify-center">
            <h3 className="text-white text-lg font-medium mb-4">Detection Status</h3>
            
            <div className="flex flex-col items-center">
              {/* Bigger Color Detection Circle */}
              <div
                className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-lg transition-all duration-300"
                style={{
                  backgroundColor: cameraState.detectedObjects.length > 0
                    ? (() => {
                        // Get the most common color or the first detected color
                        const colors = cameraState.detectedObjects.map(obj => {
                          const color = obj.color.toLowerCase();
                          if (color.includes('blue')) return '#3B82F6';
                          if (color.includes('red')) return '#EF4444';
                          if (color.includes('yellow')) return '#F59E0B';
                          return '#6B7280';
                        });
                        // Return the first detected color
                        return colors[0] || '#6B7280';
                      })()
                    : '#6B7280',
                  boxShadow: cameraState.detectedObjects.length > 0
                    ? '0 0 30px rgba(255, 255, 255, 0.4)'
                    : 'none'
                }}
              />
              
              {/* Object Count */}
              <div className="mt-4 text-center">
                <div className="text-4xl font-bold text-white">{cameraState.detectedObjects.length}</div>
                <div className="text-sm text-gray-400">Objects Detected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detected Objects - Now below the camera feed */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white text-lg font-medium mb-4">Detected Objects</h3>
        
        {cameraState.detectedObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                
                <div className="space-y-1 text-sm">
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
                  <div>
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
            <p>No objects currently detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraFeedView;