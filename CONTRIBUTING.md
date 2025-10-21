# Contributing to Universal Log Cleaner

Thank you for your interest in contributing! This guide will help you get started.

## 🌟 Ways to Contribute

- Report bugs and issues
- Suggest new features or improvements
- Add support for new languages
- Improve documentation
- Submit pull requests
- Review pull requests

## 📋 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- VS Code 1.75.0+
- Git

### Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/zahidlatifdev/universal-log-cleaner.git
cd universal-log-cleaner
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run tests**

```bash
npm test
```

5. **Run the extension**

Press `F5` in VS Code to launch the Extension Development Host.

## 🏗️ Project Structure

```
universal-log-cleaner/
├── src/
│   ├── extension.ts           # Extension entry point
│   ├── cleaner.ts             # Core cleaning logic
│   ├── config.ts              # Configuration management
│   ├── types.ts               # TypeScript type definitions
│   ├── regexBuilder.ts        # Regex pattern builders
│   ├── previewer.ts           # Preview UI
│   ├── undoManager.ts         # Undo functionality
│   ├── telemetryCheck.ts      # Telemetry guard
│   ├── detectors/             # Language detectors
│   │   ├── registry.ts        # Detector registry
│   │   ├── javascript.ts      # JavaScript detector
│   │   ├── python.ts          # Python detector
│   │   └── ...                # Other language detectors
│   └── utils/                 # Utility modules
│       ├── fileUtils.ts
│       ├── diffUtils.ts
│       └── whitelistChecker.ts
├── test/                      # Unit tests
├── examples/                  # Example files for testing
├── docs/                      # Documentation
└── .github/workflows/         # CI/CD workflows
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep commits atomic and meaningful

### 3. Run Tests and Linting

```bash
npm run lint        # Check code style
npm test            # Run unit tests
npm run build       # Ensure it builds
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add support for Kotlin language"
git commit -m "fix: resolve regex issue in Python detector"
git commit -m "docs: update README with new examples"
git commit -m "test: add tests for whitelist checker"
```

**Commit Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## 🧩 Adding a New Language Detector

### Step 1: Create Detector File

Create `src/detectors/yourlanguage.ts`:

```typescript
import { IDetector, DetectorPattern, CleanerConfig } from '../types';
import { buildCommentedLogPattern } from '../regexBuilder';

export class YourLanguageDetector implements IDetector {
  languageIds = ['yourlanguage'];
  fileExtensions = ['.yourlang'];

  buildPatterns(config: CleanerConfig): DetectorPattern[] {
    const patterns: DetectorPattern[] = [];

    // Main log pattern
    patterns.push({
      pattern: /yourlog\([^)]*\)/g,
      description: 'YourLanguage log statements',
      mode: 'singleLine',
      priority: 10,
      respectWhitelist: true,
    });

    // Commented logs (if enabled)
    if (config.removeCommentedLogs) {
      patterns.push({
        pattern: buildCommentedLogPattern('//'),
        description: 'Commented log statements',
        mode: 'singleLine',
        priority: 8,
        respectWhitelist: true,
      });
    }

    return patterns;
  }
}
```

### Step 2: Register Detector

Add to `src/detectors/registry.ts`:

```typescript
import { YourLanguageDetector } from './yourlanguage';

const detectors: IDetector[] = [
  // ... existing detectors
  new YourLanguageDetector(),
];
```

### Step 3: Add Tests

Create `test/detectors/yourlanguage.test.ts`:

```typescript
import { YourLanguageDetector } from '../../src/detectors/yourlanguage';
import { DEFAULT_CONFIG } from '../../src/config';

describe('YourLanguageDetector', () => {
  const detector = new YourLanguageDetector();

  it('should detect log statements', () => {
    const patterns = detector.buildPatterns(DEFAULT_CONFIG);
    const logPattern = patterns.find((p) => p.description.includes('log'));
    expect(logPattern).toBeDefined();

    const code = `yourlog('test');`;
    const matches = code.match(logPattern!.pattern);
    expect(matches).toBeTruthy();
  });
});
```

### Step 4: Add Example Files

Create `examples/input/sample.yourlang` with representative code.

### Step 5: Update Documentation

- Add language to README.md supported languages list
- Update CHANGELOG.md with new feature
- Add any language-specific notes

### Step 6: Test Thoroughly

```bash
npm test
npm run build
# Test in Extension Development Host (F5)
```

## 📝 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows existing style and conventions
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated (Unreleased section)
- [ ] Commit messages follow Conventional Commits
- [ ] No telemetry or tracking code added
- [ ] No external network calls at runtime
- [ ] Branch is up to date with main

## 🧪 Testing Guidelines

- Write unit tests for all new features
- Test edge cases and error conditions
- Ensure tests run offline
- Use descriptive test names
- Keep tests focused and isolated

## 📚 Documentation Standards

- Update README.md for user-facing changes
- Add JSDoc comments to functions
- Provide examples in code comments
- Keep documentation clear and concise
- Include screenshots/GIFs for UI changes

## 🔒 Security Guidelines

- No telemetry or analytics code
- No external network calls at runtime
- No data collection
- Validate all user inputs
- Handle errors gracefully
- Report security issues privately (see [SECURITY.md](SECURITY.md))

## 🐛 Bug Reports

Use GitHub Issues with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, VS Code version)
- Extension version

## 💡 Feature Requests

Use GitHub Issues with:

- Clear use case
- Proposed solution
- Alternative approaches considered
- Impact on existing functionality

## 🔄 Release Process

### Quick Release Steps

1. **Run all checks:**

   ```bash
   npm run build && npm test && npm run lint && npm run package
   ```

2. **Update version:**

   ```bash
   npm run version:patch  # or version:minor, version:major
   ```

3. **Update CHANGELOG.md:**

   - Move changes from Unreleased to new version section

4. **Commit and tag:**

   ```bash
   git add -A
   git commit -m "chore: release v1.0.1"
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin main v1.0.1
   ```

5. **Create GitHub Release:**
   - Go to GitHub Releases → New release
   - Select tag v1.0.1
   - Copy CHANGELOG entry
   - Attach .vsix files from `dist/`
   - Publish

### Pre-Publishing Checklist

- [ ] All tests pass
- [ ] Extension tested locally
- [ ] Tested with real projects
- [ ] Multiple languages verified
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json

## 📞 Getting Help

[Open an issue](https://github.com/zahidlatifdev/universal-log-cleaner/issues) for bugs or questions.

Contributors are recognized in CHANGELOG.md. Thank you! 🎉
