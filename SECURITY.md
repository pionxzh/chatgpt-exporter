# Security Policy

## Supported Versions

We actively support the latest minor version of ChatGPT Exporter. Security updates are provided for the current release only.

| Version | Supported          |
| ------- | ------------------ |
| 2.29.x  | :white_check_mark: |
| < 2.29  | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Email:** pionxzh@csie.io

**Response Time:** We aim to respond to security reports within 48 hours.

### What to Include

Please include the following information in your report:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up

### What to Expect

1. **Initial Response:** Within 48 hours
2. **Status Update:** Within 7 days with assessment
3. **Resolution Target:** Critical issues within 30 days, others within 90 days
4. **Public Disclosure:** Coordinated disclosure after patch is released

### Security Update Process

When a security issue is confirmed:

1. **Triage:** Assess severity and impact
2. **Patch:** Develop and test fix
3. **Release:** Issue security release with CVE (if applicable)
4. **Notify:** Update CHANGELOG and notify users
5. **Disclose:** Public disclosure after users have time to update

## Security Best Practices for Users

### Installation
- Only install from official sources:
  - [GreasyFork](https://greasyfork.org/scripts/456055-chatgpt-exporter)
  - [GitHub Releases](https://github.com/pionxzh/chatgpt-exporter/releases)
- Verify the userscript signature before installation

### Usage
- Keep the userscript updated to the latest version
- Review permissions requested by the script
- Use HTTPS connections only
- Be cautious when exporting sensitive conversations

### Data Privacy
- **Userscript runs locally** in your browser
- **No data is sent** to external servers
- **Exports are saved locally** to your device
- **API calls go directly** to OpenAI/ChatGPT servers

## Known Security Considerations

### Browser Storage
The userscript uses browser storage (localStorage/GM storage) to save preferences. This data is:
- Stored locally in your browser
- Accessible only to the userscript
- Not transmitted over the network
- Cleared when you uninstall the script

### Exported Data
Exported conversation files may contain:
- Personal information from your ChatGPT conversations
- API responses from OpenAI
- Metadata (timestamps, model names, etc.)

**Recommendations:**
- Store exports securely
- Encrypt sensitive exports
- Be mindful when sharing exported files

### Third-Party Dependencies
The userscript uses external libraries loaded from CDNs:
- jszip (for ZIP archive creation)
- html2canvas (for screenshot exports)

These are loaded from jsDelivr CDN with integrity checks.

## Security Changelog

### 2025-10-27 - Dependency Updates
- Fixed CVE-2025-5889 (brace-expansion ReDoS)
- Updated micromatch to 4.0.8
- Updated semver to 5.7.2
- Updated @babel/helpers to 7.28.4
- **Remaining:** 1 moderate severity in esbuild (dev-only)

### Previous Security Updates
See [CHANGELOG.md](./CHANGELOG.md) for version-specific security fixes.

## Security Tools & Auditing

### Automated Scanning
- **npm audit:** Run on every build
- **Dependabot:** Monitors dependencies for vulnerabilities
- **GitHub Security:** Automated vulnerability alerts

### Manual Review
Security-sensitive code areas:
- `/src/api.ts` - API communication
- `/src/utils/storage.ts` - Data persistence
- `/src/utils/download.ts` - File downloads
- `/src/exporter/*` - Data export formats

## Scope

### In Scope
- Userscript code vulnerabilities
- Dependency vulnerabilities
- Data leakage or privacy issues
- Authentication bypass
- XSS or code injection

### Out of Scope
- Issues in ChatGPT itself (report to OpenAI)
- Browser vulnerabilities (report to browser vendor)
- Social engineering attacks
- Denial of service attacks

## Contact

**Maintainer:** Pionxzh
**Email:** pionxzh@csie.io
**GitHub:** [@pionxzh](https://github.com/pionxzh)

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors will be acknowledged in release notes (unless they prefer to remain anonymous).

---

**Last Updated:** October 27, 2025
**Next Review:** January 27, 2026
