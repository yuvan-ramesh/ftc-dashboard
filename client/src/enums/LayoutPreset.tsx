import { Values } from '@/typeHelpers';

import TileGrid from '@/components/Layout/TileGrid';
import Tile from '@/components/Layout/Tile';
import ConfigurableLayout from '@/components/ConfigurableLayout/ConfigurableLayout';

import OpModeView from '@/components/views/OpModeView';
import CameraView from '@/components/views/CameraView';
import GraphView from '@/components/views/GraphView/GraphView';
import ConfigView from '@/components/views/ConfigView/ConfigView';
import TelemetryView from '@/components/views/TelemetryView';
import FieldView from '@/components/views/FieldView/FieldView';
import GeneralDashboard from '@/components/views/GeneralDashboard';
import EnhancedTelemetryView from '@/components/views/EnhancedTelemetryView';
import DrivetrainView from '@/components/subsystems/Drivetrain/DrivetrainView';
import DashboardLayoutTabs from '@/components/DashboardLayout/DashboardLayoutTabs';

const LayoutPreset = {
  DEFAULT: 'DEFAULT',
  FIELD: 'FIELD',
  GRAPH: 'GRAPH',
  ORIGINAL: 'ORIGINAL',
  ENHANCED: 'ENHANCED',
  CONFIGURABLE: 'CONFIGURABLE',
  SYSTEMS_DASHBOARD: 'SYSTEMS_DASHBOARD',
} as const;

type Layout = {
  name: string;
  content: JSX.Element;
};

const LAYOUT_DETAILS: { [key in Values<typeof LayoutPreset>]: Layout } = {
  [LayoutPreset.DEFAULT]: {
    name: 'Default',
    content: (
      <TileGrid gridTemplate="220px calc(60% - 220px) 40% / 30% 40% 30%">
        <Tile row="1 / span 1" col={1}>
          <OpModeView />
        </Tile>
        <Tile row="2 / span 2" col={1}>
          <CameraView />
        </Tile>
        <Tile row="1 / span 3" col={2}>
          <GraphView />
        </Tile>
        <Tile row="1 / span 2" col={3}>
          <ConfigView />
        </Tile>
        <Tile row={3} col={3}>
          <TelemetryView />
        </Tile>
      </TileGrid>
    ),
  },
  [LayoutPreset.FIELD]: {
    name: 'Field',
    content: (
      <TileGrid gridTemplate="220px calc(60% - 220px) 40% / 30% 40% 30%">
        <Tile row="1 / span 1" col={1}>
          <OpModeView />
        </Tile>
        <Tile row="2 / span 2" col={1}>
          <FieldView />
        </Tile>
        <Tile row="1 / span 3" col={2}>
          <GraphView />
        </Tile>
        <Tile row="1 / span 2" col={3}>
          <ConfigView />
        </Tile>
        <Tile row={3} col={3}>
          <TelemetryView />
        </Tile>
      </TileGrid>
    ),
  },
  [LayoutPreset.GRAPH]: {
    name: 'Graph',
    content: (
      <TileGrid gridTemplate="100% / 50% 50%">
        <Tile row={1} col={1}>
          <GraphView />
        </Tile>
        <Tile row={1} col={2}>
          <GraphView />
        </Tile>
      </TileGrid>
    ),
  },
  [LayoutPreset.ORIGINAL]: {
    name: 'Original',
    content: (
      <TileGrid gridTemplate="60% 40% / 65% 35%">
        <Tile row="1 / span 2" col={1}>
          <GraphView />
        </Tile>
        <Tile row={1} col={2}>
          <ConfigView />
        </Tile>
        <Tile row={2} col={2}>
          <TelemetryView />
        </Tile>
      </TileGrid>
    ),
  },
  [LayoutPreset.ENHANCED]: {
    name: 'Enhanced',
    content: (
      <TileGrid gridTemplate="30% 40% 30% / 25% 50% 25%">
        <Tile row={1} col="1 / span 3">
          <GeneralDashboard />
        </Tile>
        <Tile row={2} col={1}>
          <EnhancedTelemetryView />
        </Tile>
        <Tile row={2} col={2}>
          <FieldView />
        </Tile>
        <Tile row={2} col={3}>
          <DrivetrainView />
        </Tile>
        <Tile row={3} col="1 / span 2">
          <GraphView />
        </Tile>
        <Tile row={3} col={3}>
          <ConfigView />
        </Tile>
      </TileGrid>
    ),
  },
  [LayoutPreset.CONFIGURABLE]: {
    name: 'Custom',
    content: <ConfigurableLayout />,
  },
  [LayoutPreset.SYSTEMS_DASHBOARD]: {
    name: 'Systems Dashboard',
    content: <DashboardLayoutTabs />,
  },
};

export default Object.freeze({
  ...LayoutPreset,

  getName: (preset: Values<typeof LayoutPreset>) => LAYOUT_DETAILS[preset].name,

  getContent: (preset: Values<typeof LayoutPreset>) =>
    LAYOUT_DETAILS[preset]?.content ??
    LAYOUT_DETAILS[LayoutPreset.DEFAULT].content,
});

export type LayoutPresetType = Values<typeof LayoutPreset>;
