/**
 * Telemetry guard test - ensures no telemetry code exists
 */

import { scanForTelemetry } from '../src/telemetryCheck';
import * as path from 'path';

describe('Telemetry Guard', () => {
  it('should not find any telemetry patterns in source code', () => {
    const rootDir = path.join(__dirname, '..');
    const violations = scanForTelemetry(rootDir);

    expect(violations).toEqual([]);
  });
});
