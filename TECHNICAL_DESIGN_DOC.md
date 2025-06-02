# Technical Design Document
# FTC Dashboard Enhancement Project

## 1. Overview

This document details the technical implementation of the FTC Dashboard enhancement project, including architecture decisions, component design, and code changes made to fulfill the requirements outlined in the PRD.

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│   FTC Robot     │ ◄──────────────► │  Dashboard App   │
│   Controller    │                    │   (React/TS)     │
└─────────────────┘                    └─────────────────┘
         │                                      │
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│  Robot Systems  │                    │   Redux Store    │
│  - Drivetrain   │                    │   - State Mgmt   │
│  - Intake       │                    │   - Middleware   │
│  - Camera       │                    │   - Actions      │
│  - Deposit      │                    └─────────────────┘
└─────────────────┘
```

### 2.2 Frontend Architecture

```
src/
├── components/
│   ├── DashboardLayout/
│   │   └── DashboardLayoutTabs.tsx
│   ├── subsystems/
│   │   ├── Drivetrain/
│   │   ├── Intake/
│   │   ├── Deposit/
│   │   └── shared/
│   └── views/
│       ├── CameraFeedView.tsx
│       ├── FieldView/
│       └── GeneralDashboardBar.tsx
├── store/
│   ├── actions/
│   ├── reducers/
│   └── middleware/
└── enums/
    └── DashboardSection.ts
```

## 3. Component Design

### 3.1 Navigation System

#### DashboardLayoutTabs Component
**Location**: `/src/components/DashboardLayout/DashboardLayoutTabs.tsx`

**Key Features**:
- Tab-based navigation using React state
- Active section tracking
- Conditional rendering based on selected tab

```typescript
const sections = [
  { id: DashboardSection.DRIVETRAIN, label: 'Drivetrain', icon: '🚗' },
  { id: DashboardSection.INTAKE, label: 'Intake', icon: '📥' },
  { id: DashboardSection.CAMERA, label: 'Camera', icon: '📷' },
  { id: DashboardSection.DEPOSIT, label: 'Deposit', icon: '📤' },
  { id: DashboardSection.TELEMETRY, label: 'Telemetry', icon: '📊' }
];
```

### 3.2 Field Map Visualization

#### EnhancedFieldOverlay Component
**Location**: `/src/components/views/FieldView/EnhancedFieldOverlay.tsx`

**Technical Implementation**:
- Canvas-based rendering for performance
- Coordinate transformation for FTC field (144" x 144")
- Real-time path tracking with refs to avoid re-renders
- Optimized rendering with requestAnimationFrame

**Key Algorithms**:
```typescript
// Coordinate system transformation
ctx.translate(width / 2, height / 2);
ctx.scale(scale, -scale); // Flip Y axis for standard coordinates

// Field scaling
const FIELD_SIZE = 144; // inches
const scale = Math.min(width, height) / FIELD_SIZE;
```

#### FieldMapView Component
**Location**: `/src/components/subsystems/Drivetrain/FieldMapView.tsx`

**Features**:
- Dynamic canvas sizing based on available space
- Side panel for telemetry information
- Path legend with color coding

### 3.3 Camera System

#### CameraFeedView Component
**Location**: `/src/components/views/CameraFeedView.tsx`

**Implementation Details**:
- Responsive layout with flexbox
- Color detection indicator with dynamic styling
- Object detection grid with confidence visualization

```typescript
// Color detection logic
const detectedColor = cameraState.detectedObjects.length > 0
  ? (() => {
      const color = obj.color.toLowerCase();
      if (color.includes('blue')) return '#3B82F6';
      if (color.includes('red')) return '#EF4444';
      if (color.includes('yellow')) return '#F59E0B';
      return '#6B7280';
    })()
  : '#6B7280';
```

### 3.4 Servo Visualization

#### ServoPositionIndicator Component
**Location**: `/src/components/subsystems/shared/ServoPositionIndicator.tsx`

**Technical Features**:
- SVG-based circular gauge
- Dynamic tick mark generation for any degree range
- Smooth position transitions

```typescript
// Dynamic tick mark generation
Array.from({ length: Math.floor(maxDegrees / 45) + 1 }, (_, i) => i * 45)
```

### 3.5 Telemetry System

#### SubsystemTelemetry Component
**Location**: `/src/components/subsystems/shared/SubsystemTelemetry.tsx`

**Implementation**:
- Recording mechanism using refs
- Replay functionality with setInterval
- Export capability for recorded sessions

```typescript
interface TelemetryRecording {
  startTime: number;
  data: Array<{
    timestamp: number;
    values: Map<string, any>;
  }>;
}
```

## 4. State Management

### 4.1 Redux Store Structure

```typescript
interface RootState {
  subsystems: {
    drivetrain: DrivetrainState;
    intake: IntakeState;
    deposit: DepositState;
    camera: CameraState;
  };
  enhancedTelemetry: EnhancedTelemetryState;
  status: StatusState;
  settings: SettingsState;
}
```

### 4.2 WebSocket Middleware

**Location**: `/src/store/middleware/socketMiddleware.ts`

**Features**:
- Automatic reconnection
- Message queuing
- Action dispatching based on message types

## 5. Performance Optimizations

### 5.1 Canvas Rendering
- Use of `requestAnimationFrame` for smooth animations
- Canvas clearing optimization
- Batch drawing operations

### 5.2 React Optimizations
- Refs for animation data to prevent re-renders
- Memoization of expensive calculations
- Conditional rendering based on visibility

### 5.3 Data Management
- Limited history storage (1000 points max)
- Efficient data structures (typed arrays where applicable)
- Cleanup on component unmount

## 6. Styling Approach

### 6.1 Tailwind CSS Usage
- Consistent spacing with utility classes
- Dark theme with gray color palette
- Responsive design with breakpoints

### 6.2 Custom Styling
- Canvas elements styled with inline styles
- Dynamic color application based on state
- Transition effects for smooth UX

## 7. Key Code Changes Summary

### 7.1 Navigation Implementation
- Created `DashboardLayoutTabs.tsx` for tab-based navigation
- Added `DashboardSection` enum for type safety
- Implemented section switching logic

### 7.2 Field Map Enhancements
- Removed device pixel ratio complexity for stability
- Increased canvas size limits (1000px max)
- Added yellow color for position history
- Removed field labels for cleaner display
- Implemented -72 to 72 coordinate system

### 7.3 Camera Dashboard Updates
- Combined detection status with detected objects
- Added prominent color detection circle
- Reorganized layout for better space utilization
- Removed "Sample" terminology

### 7.4 Servo Visualization
- Extended tick marks to support 360-degree range
- Dynamic tick generation based on maxDegrees
- Improved visual clarity

### 7.5 Telemetry Features
- Added recording/replay functionality
- Implemented pause/resume controls
- Created export capability for sessions

## 8. WebSocket Protocol

### 8.1 Message Types
```typescript
enum MessageType {
  RECEIVE_TELEMETRY = 'RECEIVE_TELEMETRY',
  RECEIVE_ROBOT_STATUS = 'RECEIVE_ROBOT_STATUS',
  RECEIVE_CONFIG = 'RECEIVE_CONFIG',
  START_OP_MODE = 'START_OP_MODE',
  STOP_OP_MODE = 'STOP_OP_MODE'
}
```

### 8.2 Data Flow
1. Robot sends telemetry at 10+ Hz
2. Middleware processes messages
3. Actions dispatched to update store
4. Components re-render with new data

## 9. Error Handling

### 9.1 Network Errors
- Automatic WebSocket reconnection
- Connection status display
- Graceful degradation

### 9.2 Rendering Errors
- Canvas context validation
- Fallback UI for missing data
- Error boundaries for components

## 10. Testing Considerations

### 10.1 Unit Testing
- Component rendering tests
- State management tests
- Utility function tests

### 10.2 Integration Testing
- WebSocket communication
- Canvas rendering
- User interactions

## 11. Deployment

### 11.1 Build Process
```bash
npm run build
```

### 11.2 Environment Configuration
- WebSocket URL configuration
- Camera stream endpoint
- API endpoints

## 12. Future Technical Improvements

### 12.1 Performance
- WebGL rendering for complex visualizations
- Web Workers for heavy calculations
- Virtual scrolling for large datasets

### 12.2 Architecture
- Module federation for micro-frontends
- GraphQL for more efficient data fetching
- Service Worker for offline capability

### 12.3 Features
- 3D visualization of robot
- AR overlays for field view
- AI-powered analytics

## 13. Code Quality Standards

### 13.1 TypeScript
- Strict type checking enabled
- Interface definitions for all data structures
- Proper generic usage

### 13.2 React Best Practices
- Functional components with hooks
- Proper dependency arrays
- Error boundaries implementation

### 13.3 Code Organization
- Feature-based folder structure
- Shared components in common folder
- Consistent naming conventions

## 14. Security Considerations

### 14.1 WebSocket Security
- Authentication tokens
- Message validation
- Rate limiting

### 14.2 Data Protection
- No sensitive data in localStorage
- Secure camera feed endpoints
- Input sanitization

## 15. Conclusion

This technical design has successfully implemented a comprehensive FTC Dashboard system with advanced visualization, real-time telemetry, and intuitive controls. The modular architecture allows for easy extension and maintenance while providing excellent performance for competition use.