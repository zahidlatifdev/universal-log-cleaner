/**
 * Telemetry guard - automated check for telemetry usage
 * This file is used in tests to ensure no telemetry code exists
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Known telemetry packages and APIs to detect
 */
const TELEMETRY_PATTERNS = [
  // Package names
  'applicationinsights',
  'vscode-extension-telemetry',
  '@vscode/extension-telemetry',
  'analytics',
  'segment',
  'mixpanel',
  'google-analytics',
  'amplitude',
  'posthog',
  'sentry',
  '@sentry',

  // API patterns
  'TelemetryReporter',
  'appInsights',
  'trackEvent',
  'trackException',
  'trackTrace',
  'trackMetric',
  'trackPageView',
  'sendTelemetry',
  'reportTelemetry',
  'analytics.track',
  'mixpanel.track',
  'Sentry.captureException',
  'Sentry.captureMessage',
];

/**
 * Scan source files for telemetry usage
 * @param rootDir Root directory to scan
 * @returns Array of violations found
 */
export function scanForTelemetry(rootDir: string): string[] {
  const violations: string[] = [];
  const srcDir = path.join(rootDir, 'src');

  if (!fs.existsSync(srcDir)) {
    return ['Source directory not found'];
  }

  const files = getAllFiles(srcDir, ['.ts', '.js']);

  for (const file of files) {
    const relPath = path.relative(rootDir, file);

    // Skip telemetryCheck.ts itself (it contains the patterns to check for)
    if (relPath.includes('telemetryCheck.ts')) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');

    for (const pattern of TELEMETRY_PATTERNS) {
      if (content.includes(pattern)) {
        violations.push(`${relPath}: Found telemetry pattern "${pattern}"`);
      }
    }
  }

  // Also check package.json
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.optionalDependencies,
    };

    for (const dep of Object.keys(deps)) {
      for (const pattern of TELEMETRY_PATTERNS) {
        if (dep.includes(pattern)) {
          violations.push(`package.json: Found telemetry dependency "${dep}"`);
        }
      }
    }
  }

  return violations;
}

/**
 * Get all files with specific extensions recursively
 * @param dir Directory to scan
 * @param extensions File extensions to include
 * @returns Array of file paths
 */
function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}
