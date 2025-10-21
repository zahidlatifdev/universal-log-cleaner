/**
 * Detector registry - maps language IDs to detector implementations
 */

import { IDetector } from '../types';
import { JavaScriptDetector } from './javascript';
import { TypeScriptDetector } from './typescript';
import { PythonDetector } from './python';
import { JavaDetector } from './java';
import { PHPDetector } from './php';
import { CSharpDetector } from './csharp';
import { GoDetector } from './go';
import { RustDetector } from './rust';
import { SwiftDetector } from './swift';
import { CDetector } from './c';
import { CppDetector } from './cpp';
import { RubyDetector } from './ruby';
import { DartDetector } from './dart';
import { ShellDetector } from './shell';
import { SQLDetector } from './sql';
import { HTMLDetector } from './html';
import { CSSDetector } from './css';
import { SCSSDetector } from './scss';
import { LessDetector } from './less';
import { MarkdownDetector } from './markdown';

/**
 * All registered detectors
 */
const detectors: IDetector[] = [
  new JavaScriptDetector(),
  new TypeScriptDetector(),
  new PythonDetector(),
  new JavaDetector(),
  new PHPDetector(),
  new CSharpDetector(),
  new GoDetector(),
  new RustDetector(),
  new SwiftDetector(),
  new CDetector(),
  new CppDetector(),
  new RubyDetector(),
  new DartDetector(),
  new ShellDetector(),
  new SQLDetector(),
  new HTMLDetector(),
  new CSSDetector(),
  new SCSSDetector(),
  new LessDetector(),
  new MarkdownDetector(),
];

/**
 * Get detector for a specific language
 * @param languageId VS Code language identifier
 * @returns Detector or undefined if not found
 */
export function getDetectorForLanguage(languageId: string): IDetector | undefined {
  return detectors.find((d) => d.languageIds.includes(languageId));
}

/**
 * Get all registered detectors
 * @returns Array of all detectors
 */
export function getAllDetectors(): IDetector[] {
  return [...detectors];
}
