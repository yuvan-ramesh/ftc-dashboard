import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import BaseView, { BaseViewHeading } from '@/components/views/BaseView';
import AutoFitCanvas from '@/components/Canvas/AutoFitCanvas';
import Field from './Field';
import EnhancedFieldOverlay from './EnhancedFieldOverlay';

interface EnhancedFieldViewProps {
  isDraggable?: boolean;
  isUnlocked?: boolean;
}

const EnhancedFieldView: React.FC<EnhancedFieldViewProps> = ({
  isDraggable,
  isUnlocked,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<Field | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const telemetry = useSelector((state: RootState) => state.telemetry);
  const replay = useSelector((state: RootState) => state.replay);
  const showEnhancedOverlay = useSelector(
    (state: RootState) => state.settings.showEnhancedFieldOverlay ?? true
  );
  
  React.useEffect(() => {
    if (canvasRef.current && !fieldRef.current) {
      fieldRef.current = new Field(canvasRef.current);
    }
  }, []);
  
  React.useEffect(() => {
    if (!fieldRef.current) return;
    
    const replayOps = replay.ops || [];
    let overlay = { ops: [] as any[] };
    
    telemetry.forEach(({ field, fieldOverlay }) => {
      if (fieldOverlay.ops.length > 0) {
        overlay = {
          ops: [...field.ops, ...fieldOverlay.ops],
        };
      }
    });
    
    fieldRef.current.setOverlay({
      ...overlay,
      ops: [...overlay.ops, ...replayOps],
    });
    
    fieldRef.current.render();
  }, [telemetry, replay]);
  
  const handleResize = (width: number, height: number) => {
    setCanvasSize({ width, height });
    if (fieldRef.current) {
      fieldRef.current.render();
    }
  };
  
  return (
    <BaseView isUnlocked={isUnlocked}>
      <BaseViewHeading isDraggable={isDraggable}>
        Enhanced Field View
      </BaseViewHeading>
      <div className="relative h-full">
        <AutoFitCanvas
          ref={canvasRef}
          onResize={handleResize}
          containerHeight="calc(100% - 3em)"
        />
        {showEnhancedOverlay && (
          <canvas
            ref={overlayCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: '100%', height: 'calc(100% - 3em)' }}
          />
        )}
        {showEnhancedOverlay && (
          <EnhancedFieldOverlay
            canvasRef={overlayCanvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
          />
        )}
        
        {/* Toggle button for enhanced overlay */}
        <button
          onClick={() => {
            // This would need to be connected to a settings action
            console.log('Toggle enhanced overlay');
          }}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
        >
          {showEnhancedOverlay ? 'Hide' : 'Show'} Enhanced Overlay
        </button>
      </div>
    </BaseView>
  );
};

export default EnhancedFieldView;