import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import TelemetryGraph from '@/components/subsystems/shared/TelemetryGraph';
import { ReactComponent as AddIcon } from '@/assets/icons/add.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/remove_circle.svg';

interface GraphConfig {
  id: string;
  telemetryKey: string;
  title: string;
  color: string;
}

const TelemetryGraphManager: React.FC = () => {
  const [graphs, setGraphs] = useState<GraphConfig[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGraphKey, setNewGraphKey] = useState('');
  const [newGraphTitle, setNewGraphTitle] = useState('');
  
  const telemetry = useSelector((state: RootState) => state.enhancedTelemetry);
  
  // Get all numeric telemetry values
  const numericValues = React.useMemo(() => {
    const values: Array<{ key: string; section: string }> = [];
    
    telemetry.sections.forEach(section => {
      section.values.forEach((value, key) => {
        if (typeof value.value === 'number') {
          values.push({
            key: `${section.id}.${key}`,
            section: section.name,
          });
        }
      });
    });
    
    return values;
  }, [telemetry.sections]);
  
  const handleAddGraph = () => {
    if (newGraphKey && newGraphTitle) {
      const newGraph: GraphConfig = {
        id: Date.now().toString(),
        telemetryKey: newGraphKey,
        title: newGraphTitle,
        color: getRandomColor(),
      };
      setGraphs([...graphs, newGraph]);
      setNewGraphKey('');
      setNewGraphTitle('');
      setShowAddDialog(false);
    }
  };
  
  const handleRemoveGraph = (id: string) => {
    setGraphs(graphs.filter(g => g.id !== id));
  };
  
  const getRandomColor = () => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Telemetry Graphs</h3>
        <button
          onClick={() => setShowAddDialog(true)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <AddIcon className="w-4 h-4" />
          Add Graph
        </button>
      </div>
      
      {/* Add Graph Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-white mb-4">Add Telemetry Graph</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Value
                </label>
                <select
                  value={newGraphKey}
                  onChange={(e) => {
                    setNewGraphKey(e.target.value);
                    const [section, key] = e.target.value.split('.');
                    setNewGraphTitle(`${section} - ${key}`);
                  }}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a value...</option>
                  {numericValues.map(({ key, section }) => (
                    <option key={key} value={key}>
                      {section} - {key.split('.')[1]}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Graph Title
                </label>
                <input
                  type="text"
                  value={newGraphTitle}
                  onChange={(e) => setNewGraphTitle(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter graph title..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddDialog(false);
                  setNewGraphKey('');
                  setNewGraphTitle('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGraph}
                disabled={!newGraphKey || !newGraphTitle}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Graph
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Graphs Grid */}
      {graphs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {graphs.map(graph => (
            <div key={graph.id} className="relative">
              <TelemetryGraph
                telemetryKey={graph.telemetryKey}
                title={graph.title}
                color={graph.color}
                height={200}
              />
              <button
                onClick={() => handleRemoveGraph(graph.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                title="Remove graph"
              >
                <RemoveIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No graphs added yet. Click "Add Graph" to create one.</p>
        </div>
      )}
    </div>
  );
};

export default TelemetryGraphManager;