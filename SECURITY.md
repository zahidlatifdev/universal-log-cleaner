# Security Policy

## 🔒 Security Commitment

Universal Log Cleaner is committed to protecting user privacy and security:

- ✅ **No Telemetry** - Zero tracking or analytics
- ✅ **No Network Calls** - 100% offline at runtime
- ✅ **No Data Collection** - Your code never leaves your machine
- ✅ **No Remote Code Execution** - All processing is local
- ✅ **Open Source** - Full transparency

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 🐛 Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow responsible disclosure:

### ⚠️ Do NOT

- Open a public GitHub issue
- Discuss the vulnerability publicly
- Exploit the vulnerability

### ✅ Do

1. **Email** security concerns to: [zahidlatif.dev@gmail.com]
2. **Include** the following information:

   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

3. **Wait** for acknowledgment (within 48 hours)

### 📋 Security Review Process

1. **Acknowledgment** - We'll confirm receipt within 48 hours
2. **Assessment** - We'll evaluate severity and impact
3. **Fix Development** - We'll develop and test a fix
4. **Disclosure** - We'll coordinate public disclosure with you
5. **Release** - We'll release a patched version
6. **Credit** - We'll credit you in the security advisory (unless you prefer anonymity)

## 🔍 Security Checklist

The project maintains these security practices:

### Code Security

- [ ] No telemetry packages in dependencies
- [ ] No network calls at runtime (build-time only for npm install)
- [ ] Input validation on all user-provided data
- [ ] Sandboxed file operations
- [ ] No execution of user code
- [ ] No eval() or Function() constructors
- [ ] Safe regex patterns (no ReDoS vulnerabilities)

### Dependency Security

- [ ] Regular dependency audits (`npm audit`)
- [ ] Pinned production dependencies
- [ ] Minimal dependency surface
- [ ] No known vulnerable packages

### Privacy Security

- [ ] No data sent to external services
- [ ] No local storage of sensitive data
- [ ] File operations respect VS Code security model
- [ ] No code uploaded or shared externally

### Build Security

- [ ] Automated security tests in CI
- [ ] Telemetry guard test
- [ ] Lint checks for security patterns
- [ ] Code review required for all changes

## 🔐 Security Features

### Automated Telemetry Guard

The extension includes `telemetryCheck.ts` that automatically scans for:

- Telemetry package names
- Analytics SDKs
- Tracking API patterns
- External network calls

This test runs in CI and will fail if any telemetry code is detected.

### File Size Limits

- Maximum file size: 500 KB (configurable)
- Prevents memory exhaustion
- Protects against processing very large files

### Pattern Whitelisting

- Users can protect specific logs with `@keep` tags
- Prevents accidental removal of important logs
- Configurable whitelist tags

### Exclusion Patterns

- Respects `.gitignore`-style patterns
- Skips `node_modules`, `dist`, etc.
- Configurable per-workspace

## 📊 Known Security Limitations

1. **Regex Complexity** - Complex regex patterns may have performance implications on extremely large files
2. **File Modification** - Extension modifies source files (by design) - use version control
3. **Undo Limitation** - Only single-level undo supported

## 🔄 Security Updates

- Security patches are released as soon as possible
- Critical vulnerabilities are prioritized
- Users are notified via GitHub security advisories
- Updates are documented in CHANGELOG.md

## 📜 Security Audit History

| Date       | Auditor         | Findings                    | Status      |
| ---------- | --------------- | --------------------------- | ----------- |
| 2025-01-XX | Initial Release | Telemetry guard implemented | ✅ Resolved |

## 🤝 Security Contributors

We recognize and thank security researchers who responsibly disclose vulnerabilities:

- (Contributors will be listed here)

## 📖 Additional Resources

- [VS Code Extension Security Best Practices](https://code.visualstudio.com/api/references/extension-guidelines#security)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

## 📞 Contact

- **Security Issues**: [your-email@example.com]
- **General Issues**: [GitHub Issues](https://github.com/zahidlatifdev/universal-log-cleaner/issues)
- **Questions**: [GitHub Discussions](https://github.com/zahidlatifdev/universal-log-cleaner/discussions)

---

**Last Updated**: 2025-10-22
