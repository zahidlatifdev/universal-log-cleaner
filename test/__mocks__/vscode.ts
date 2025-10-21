/**
 * Mock vscode module for unit tests
 */

export const workspace = {
  getConfiguration: (_section?: string) => ({
    get: (_key: string, defaultValue?: any) => defaultValue,
    update: async () => {},
  }),
  workspaceFolders: undefined,
  openTextDocument: async () => ({}),
  fs: {
    stat: async () => ({ size: 0 }),
    readFile: async () => Buffer.from(''),
    writeFile: async () => {},
  },
  findFiles: async () => [],
};

export const window = {
  showInformationMessage: async () => {},
  showWarningMessage: async () => {},
  showErrorMessage: async () => {},
  showQuickPick: async () => undefined,
  withProgress: async (_options: any, task: any) => task({ report: () => {} }),
  activeTextEditor: undefined,
  createStatusBarItem: () => ({
    text: '',
    tooltip: '',
    command: '',
    show: () => {},
    hide: () => {},
    dispose: () => {},
  }),
  showTextDocument: async () => ({}),
};

export const commands = {
  registerCommand: () => ({ dispose: () => {} }),
  executeCommand: async () => {},
};

export enum StatusBarAlignment {
  Left = 1,
  Right = 2,
}

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}

export class Uri {
  static file(path: string): Uri {
    return { fsPath: path } as Uri;
  }

  static parse(value: string): Uri {
    return { fsPath: value } as Uri;
  }

  fsPath!: string;
}

export class Position {
  constructor(
    public line: number,
    public character: number
  ) {}
}

export class Range {
  constructor(
    public start: Position,
    public end: Position
  ) {}
}

export enum ProgressLocation {
  SourceControl = 1,
  Window = 10,
  Notification = 15,
}

export class RelativePattern {
  constructor(
    public base: any,
    public pattern: string
  ) {}
}
