# Enhanced FTC Dashboard Features

This document describes the new enhanced features added to the FTC Dashboard to provide better monitoring and control capabilities for FTC robots.

## New Components

### 1. Subsystem Views

#### Drivetrain View
- **Real-time position tracking** (X, Y, Z/θ)
- **Velocity and acceleration monitoring** with visual indicators
- **Encoder values display** for all four wheels
- **Center of gravity indicator** with stability warnings
- **PID performance graphs** for drivetrain control
- **Position history trail** on field view

#### Intake View
- **Slide position control** with visual slider
- **Claw status indicator** with sample detection
- **State machine visualization** showing current intake state
- **Servo position monitoring**
- **PID graphs** for slide control
- **Sensor value display**

#### Deposit View
- **Slide position control** with height zones
- **Deposit status indicator** (deposited/not deposited)
- **State machine display** for deposit states
- **Zone indicators** (Ground/Low/Medium/High)
- **PID performance monitoring**

### 2. Enhanced Telemetry System

- **Sectioned telemetry display** organized by subsystem
- **Pause functionality** to freeze values for debugging
- **Collapsible sections** for better organization
- **One-click graph creation** for any numeric value
- **Real-time value updates** with timestamps
- **Buffer system** for paused telemetry

### 3. General Dashboard

- **Match timer** with Auto/TeleOp modes
- **Voltage and current monitoring** with visual warnings
- **Battery percentage indicator**
- **OpMode controls** (Init/Start/Stop)
- **System status display**
- **Power warnings** for low voltage or high current

### 4. Enhanced Field Overlay

- **Robot position tracking** with trail history
- **Center of gravity visualization**
- **Coordinate grid** with labels
- **Velocity vectors** displayed on robot
- **Field zone labels** (Red/Blue Alliance, Audience/Backstage)
- **Real-time telemetry overlay** on field view

### 5. Reusable Components

#### PID Graph Component
- **Multi-line graphs** showing setpoint, actual, error, and output
- **Auto-scaling** based on data range
- **Color-coded lines** for easy identification
- **Current value display**
- **Time-windowed data** (configurable)

#### Slider Control Component
- **Visual slider** with current and target positions
- **Quick-set buttons** for common positions
- **Manual input** for precise control
- **Min/max limits** visualization
- **Real-time position feedback**

## Using the New Features

### Accessing New Views

1. Use the **Custom Layout** mode
2. Click the **+** button to add new views
3. Select from the new view options:
   - Drivetrain
   - Intake
   - Deposit
   - Enhanced Telemetry
   - General Dashboard

### Layout Presets

A new **Enhanced** layout preset is available that includes:
- General Dashboard at the top
- Enhanced Telemetry, Field View, and Drivetrain in the middle
- Graphs and Config at the bottom

### WebSocket Message Format

The enhanced dashboard expects new message types from the robot:

#### Subsystem Update Message
```json
{
  "type": "SUBSYSTEM_UPDATE",
  "subsystem": "drivetrain|intake|deposit|camera|general",
  "data": {
    // Subsystem-specific data
  },
  "timestamp": 1234567890
}
```

#### Enhanced Telemetry Message
```json
{
  "type": "TELEMETRY_UPDATE",
  "section": "drivetrain|intake|deposit|claw|general",
  "values": [
    {
      "key": "variableName",
      "value": 123.45,
      "unit": "mm"
    }
  ],
  "timestamp": 1234567890
}
```

## Java Integration

To use these features, the robot code needs to send the appropriate messages:

```java
// Example: Send drivetrain update
JSONObject update = new JSONObject();
update.put("type", "SUBSYSTEM_UPDATE");
update.put("subsystem", "drivetrain");
update.put("timestamp", System.currentTimeMillis());

JSONObject data = new JSONObject();
data.put("position", new JSONObject()
    .put("x", robot.getX())
    .put("y", robot.getY())
    .put("z", robot.getZ()));
data.put("velocity", new JSONObject()
    .put("x", robot.getVx())
    .put("y", robot.getVy())
    .put("z", robot.getVz()));
data.put("heading", robot.getHeading());

update.put("data", data);
dashboard.sendTelemetryPacket(update);
```

## Performance Considerations

- The enhanced features use efficient rendering techniques
- Position history is limited to the last 100 points
- Graphs maintain a sliding time window to prevent memory issues
- Paused telemetry buffers up to 1000 packets

## Future Enhancements

- Camera view with object detection overlays (partially implemented)
- Recording and playback of telemetry data
- Custom alerts and notifications
- Integration with FTC game-specific elements