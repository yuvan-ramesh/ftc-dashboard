# Dashboard Store Usage - Separate Stores

Each dashboard component now has its own dedicated store section with types, reducers, and actions.

## Store Structure

```
store/
├── types/          # Type definitions
│   ├── servos.ts
│   ├── slides.ts
│   ├── states.ts
│   ├── drivetrainData.ts
│   ├── graphData.ts
│   ├── opModeData.ts
│   ├── powerData.ts
│   ├── connectionData.ts
│   ├── cameraData.ts
│   └── clawData.ts
├── reducers/       # State management
│   └── [same files as types]
└── actions/        # Action creators
    └── [same files as types]
```

## Usage Examples

### 1. Servos

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/reducers';
import { updateServoPosition, updateMultipleServoPositions } from './store/actions/servos';

// Read servo data
const servos = useSelector((state: RootState) => state.servos.servos);
const clawPosition = servos.find(s => s.name === 'claw')?.position;

// Update single servo
dispatch(updateServoPosition('claw', 180));

// Update multiple servos
dispatch(updateMultipleServoPositions({
  claw: 90,
  wrist: 45,
  arm: 180
}));
```

### 2. Slides

```typescript
import { updateIntakeSlide, updateDepositSlide, updateBothSlides } from './store/actions/slides';

// Read slide positions
const intakePosition = useSelector((state: RootState) => state.slides.intake.position);
const depositPosition = useSelector((state: RootState) => state.slides.deposit.position);

// Update slides
dispatch(updateIntakeSlide(75.5));
dispatch(updateDepositSlide(50.0));
dispatch(updateBothSlides(75.5, 50.0));
```

### 3. States

```typescript
import { setCurrentState, addState } from './store/actions/states';

// Read states
const currentState = useSelector((state: RootState) => state.states.currentState);
const allStates = useSelector((state: RootState) => state.states.states);

// Update states
dispatch(setCurrentState('RUNNING'));
dispatch(addState('AUTONOMOUS', true));
```

### 4. Drivetrain

```typescript
import { updateDrivetrainPosition, updateVelocityAccel, updateEncoders } from './store/actions/drivetrainData';

// Read drivetrain data
const position = useSelector((state: RootState) => state.drivetrainData.position);
const velocity = useSelector((state: RootState) => state.drivetrainData.velocityAccel.velocity);

// Update drivetrain
dispatch(updateDrivetrainPosition(10.5, 20.3, 0, Math.PI/4));
dispatch(updateVelocityAccel(5.2, 0.8));
dispatch(updateEncoders(1000, 1050, 1000, 1050));
```

### 5. Graphs

```typescript
import { updateGraphData, addGraph } from './store/actions/graphData';

// Read graph data
const graphs = useSelector((state: RootState) => state.graphData.graphs);
const voltageGraph = graphs.find(g => g.id === 'voltage-graph');

// Update graph data
dispatch(updateGraphData('voltage-graph', 12.5));
dispatch(updateGraphData('current-graph', 15.3));
```

### 6. OpMode

```typescript
import { updateOpMode, updateOpModeStatus } from './store/actions/opModeData';

// Read OpMode data
const opMode = useSelector((state: RootState) => state.opModeData);

// Update OpMode
dispatch(updateOpMode('Autonomous', 'RUNNING'));
dispatch(updateOpModeStatus('STOPPED'));
```

### 7. Power

```typescript
import { updatePower, updateVoltage } from './store/actions/powerData';

// Read power data
const voltage = useSelector((state: RootState) => state.powerData.voltage);
const current = useSelector((state: RootState) => state.powerData.current);

// Update power
dispatch(updatePower(12.5, 15.3));
dispatch(updateVoltage(12.3));
```

### 8. Connection

```typescript
import { setConnected, setDisconnected } from './store/actions/connectionData';

// Read connection status
const isConnected = useSelector((state: RootState) => state.connectionData.isConnected);
const status = useSelector((state: RootState) => state.connectionData.status);

// Update connection
dispatch(setConnected('Robot connected'));
dispatch(setDisconnected('Connection lost'));
```

### 9. Camera

```typescript
import { updateCameraFeed, updateColorDetection, updateCameraStats } from './store/actions/cameraData';

// Read camera data
const cameraFeed = useSelector((state: RootState) => state.cameraData.feed);
const detection = useSelector((state: RootState) => state.cameraData.detection);

// Update camera
dispatch(updateCameraFeed('http://192.168.1.100:8080/stream', true));
dispatch(updateColorDetection('red', 3));
dispatch(updateCameraStats(30, 25));
```

### 10. Claw

```typescript
import { updateClawStatus, setHasSample, setNoSample } from './store/actions/clawData';

// Read claw status
const hasSample = useSelector((state: RootState) => state.clawData.hasSample);

// Update claw
dispatch(updateClawStatus(true));
dispatch(setHasSample());
dispatch(setNoSample());
```

## Complete State Structure

```typescript
interface RootState {
  // ... existing states ...
  
  // New dashboard states
  servos: {
    servos: Array<{ name: string; position: number }>
  };
  slides: {
    intake: { position: number };
    deposit: { position: number };
  };
  states: {
    states: Array<{ name: string; active?: boolean }>;
    currentState: string | null;
  };
  drivetrainData: {
    position: { x: number; y: number; z: number; heading: number };
    velocityAccel: { velocity: number; acceleration: number };
    centerOfGravity: { xOffset: number; yOffset: number };
    encoders: { leftFront: number; rightFront: number; leftBack: number; rightBack: number };
  };
  graphData: {
    graphs: Array<{ id: string; values: Array<{ timestamp: number; value: number }> }>;
  };
  opModeData: {
    name: string;
    status: string;
  };
  powerData: {
    voltage: number;
    current: number;
  };
  connectionData: {
    isConnected: boolean;
    status: string;
  };
  cameraData: {
    feed: { feedUrl?: string; isActive: boolean };
    detection: {
      colorName: string;
      objectCount: number;
      fps: number;
      resolution: { width: number; height: number };
      processingTime: number;
    };
  };
  clawData: {
    hasSample: boolean;
  };
}
```