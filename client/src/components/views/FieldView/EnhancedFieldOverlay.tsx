import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

interface EnhancedFieldOverlayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}

const EnhancedFieldOverlay: React.FC<EnhancedFieldOverlayProps> = ({
  canvasRef,
  width,
  height,
}) => {
  const drivetrain = useSelector((state: RootState) => state.subsystems.drivetrain);
  const status = useSelector((state: RootState) => state.status);
  const animationFrameRef = useRef<number>();
  const actualPathRef = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);
  const plannedPathRef = useRef<Array<{ x: number; y: number }>>([]);
  
  // Field dimensions in inches (FTC standard field is 144" x 144")
  const FIELD_SIZE = 144;
  const scale = Math.min(width, height) / FIELD_SIZE;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set coordinate system (center origin, +X right, +Y up)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, -scale); // Negative Y scale to flip Y axis
      
      // Draw field grid
      drawFieldGrid(ctx);
      
      // Draw planned path (blue) - only in auto mode
      if (status.activeOpModeStatus === 'RUNNING' && drivetrain.plannedPath?.length > 0) {
        drawPath(ctx, drivetrain.plannedPath, 'rgba(59, 130, 246, 0.6)', 3, true); // Blue for planned
      }
      
      // Update and draw actual path (green)
      if (status.activeOpModeStatus === 'RUNNING') {
        actualPathRef.current.push({
          x: drivetrain.position.x,
          y: drivetrain.position.y,
          timestamp: Date.now()
        });
        // Keep only last 1000 points
        if (actualPathRef.current.length > 1000) {
          actualPathRef.current = actualPathRef.current.slice(-1000);
        }
      } else if (status.activeOpModeStatus === 'STOPPED') {
        // Clear paths when OpMode stops
        actualPathRef.current = [];
      }
      
      if (actualPathRef.current.length > 1) {
        drawPath(ctx, actualPathRef.current, 'rgba(34, 197, 94, 0.8)', 2, false); // Green for actual
      }
      
      // Draw position history trail (lighter trail)
      drawPositionTrail(ctx, drivetrain.positionHistory);
      
      // Draw robot
      drawRobot(ctx, drivetrain.position, drivetrain.heading, drivetrain.centerOfGravity);
      
      // Draw coordinate labels
      ctx.restore();
      drawCoordinateLabels(ctx, width, height, scale);
      
      // Draw telemetry overlay
      drawTelemetryOverlay(ctx, drivetrain, width, height);
      
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drivetrain, width, height, scale]);
  
  return null; // This component only manages the canvas drawing
};

function drawFieldGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  
  // Draw grid lines every 12 inches
  for (let x = -72; x <= 72; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, -72);
    ctx.lineTo(x, 72);
    ctx.stroke();
  }
  
  for (let y = -72; y <= 72; y += 12) {
    ctx.beginPath();
    ctx.moveTo(-72, y);
    ctx.lineTo(72, y);
    ctx.stroke();
  }
  
  // Draw field boundary
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-72, -72, 144, 144);
  
  // Draw center lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-72, 0);
  ctx.lineTo(72, 0);
  ctx.moveTo(0, -72);
  ctx.lineTo(0, 72);
  ctx.stroke();
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  path: Array<{ x: number; y: number }>,
  color: string,
  lineWidth: number,
  isDashed: boolean
) {
  if (path.length < 2) return;
  
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  if (isDashed) {
    ctx.setLineDash([5, 5]);
  }
  
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  
  ctx.setLineDash([]); // Reset dash
  
  // Draw waypoints for planned path
  if (isDashed) {
    ctx.fillStyle = color;
    path.forEach((point, index) => {
      if (index % 5 === 0 || index === path.length - 1) { // Every 5th point or last point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

function drawPositionTrail(
  ctx: CanvasRenderingContext2D,
  positionHistory: Array<{ position: { x: number; y: number; z: number }; timestamp: number }>
) {
  if (positionHistory.length < 2) return;
  
  ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)'; // Gray trail for history
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  positionHistory.forEach((entry, index) => {
    if (index === 0) {
      ctx.moveTo(entry.position.x, entry.position.y);
    } else {
      ctx.lineTo(entry.position.x, entry.position.y);
    }
  });
  
  ctx.stroke();
}

function drawRobot(
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number; z: number },
  heading: number,
  centerOfGravity: { x: number; y: number }
) {
  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate(heading);
  
  // Robot dimensions (18" x 18" standard)
  const robotSize = 18;
  
  // Draw robot body
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.fillRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize);
  ctx.strokeRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize);
  
  // Draw heading indicator
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, robotSize / 2);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw arrow for heading
  ctx.beginPath();
  ctx.moveTo(-3, robotSize / 2 - 5);
  ctx.lineTo(0, robotSize / 2);
  ctx.lineTo(3, robotSize / 2 - 5);
  ctx.stroke();
  
  // Draw center of gravity
  ctx.beginPath();
  ctx.arc(centerOfGravity.x, centerOfGravity.y, 2, 0, Math.PI * 2);
  ctx.fillStyle = centerOfGravity.x * centerOfGravity.x + centerOfGravity.y * centerOfGravity.y > 25
    ? '#EF4444' // Red if outside safe zone
    : '#10B981'; // Green if safe
  ctx.fill();
  
  // Draw COG crosshair
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerOfGravity.x - 4, centerOfGravity.y);
  ctx.lineTo(centerOfGravity.x + 4, centerOfGravity.y);
  ctx.moveTo(centerOfGravity.x, centerOfGravity.y - 4);
  ctx.lineTo(centerOfGravity.x, centerOfGravity.y + 4);
  ctx.stroke();
  
  ctx.restore();
}

function drawCoordinateLabels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number
) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // X-axis labels
  for (let x = -60; x <= 60; x += 60) {
    const screenX = width / 2 + x * scale;
    ctx.fillText(`${x}"`, screenX, height - 10);
  }
  
  // Y-axis labels
  ctx.textAlign = 'right';
  for (let y = -60; y <= 60; y += 60) {
    const screenY = height / 2 - y * scale;
    ctx.fillText(`${y}"`, 30, screenY);
  }
  
  // Field labels
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px sans-serif';
  ctx.fillText('Red Alliance', width / 2 + 60 * scale, 20);
  ctx.fillText('Blue Alliance', width / 2 - 60 * scale, 20);
  ctx.fillText('Audience', width - 60, height / 2);
  ctx.fillText('Backstage', 60, height / 2);
}

function drawTelemetryOverlay(
  ctx: CanvasRenderingContext2D,
  drivetrain: any,
  width: number,
  height: number
) {
  // Position info
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 200, 90);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  ctx.fillText(`X: ${drivetrain.position.x.toFixed(1)}"`, 20, 20);
  ctx.fillText(`Y: ${drivetrain.position.y.toFixed(1)}"`, 20, 40);
  ctx.fillText(`θ: ${(drivetrain.heading * 180 / Math.PI).toFixed(1)}°`, 20, 60);
  ctx.fillText(`COG: (${drivetrain.centerOfGravity.x.toFixed(1)}, ${drivetrain.centerOfGravity.y.toFixed(1)})`, 20, 80);
  
  // Path legend
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, height - 80, 150, 70);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px sans-serif';
  ctx.fillText('Path Legend:', 20, height - 65);
  
  // Blue line for planned
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(20, height - 45);
  ctx.lineTo(50, height - 45);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Planned', 55, height - 42);
  
  // Green line for actual
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
  ctx.beginPath();
  ctx.moveTo(20, height - 25);
  ctx.lineTo(50, height - 25);
  ctx.stroke();
  ctx.fillText('Actual', 55, height - 22);
  
  // Velocity info
  const velocity = drivetrain.velocity;
  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(width - 210, 10, 200, 70);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'right';
  ctx.fillText(`Speed: ${speed.toFixed(1)} in/s`, width - 20, 20);
  ctx.fillText(`Vx: ${velocity.x.toFixed(1)} in/s`, width - 20, 40);
  ctx.fillText(`Vy: ${velocity.y.toFixed(1)} in/s`, width - 20, 60);
}

export default EnhancedFieldOverlay;