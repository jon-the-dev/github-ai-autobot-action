# GitHub AI Autobot Action v2 🤖

> **An intelligent, enterprise-grade code review automation tool powered by OpenAI GPT and Anthropic Claude**

**GitHub AI Autobot Action v2** is a significant evolution of the original [ai-codereviewer](https://github.com/villesau/ai-codereviewer) project by [Ville Saukkonen](https://github.com/villesau). This v2 represents a complete architectural overhaul with enhanced security, scalability, and enterprise-grade features designed for modern DevSecOps workflows.

## 🎯 What's New in v2

- **🔧 Enhanced Architecture**: Completely redesigned with modern TypeScript patterns
- **🔒 Security First**: Built with security and compliance in mind
- **⚡ Performance Optimized**: Faster processing with improved error handling
- **🛡️ Enterprise Ready**: Designed for scale with proper logging and monitoring
- **🚀 Modern UX**: Enhanced user experience with better feedback and status indicators
- **🔍 Advanced Analysis**: Improved code analysis with focus on security, performance, and best practices

## 🚀 Quick Start

Create `.github/workflows/ai-autobot-review.yml`:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions: write-all

jobs:
  ai_review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: AI Code Review
        uses: jon-the-dev/github-ai-autobot-action@v2
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          AI_MODEL: "gpt-4o"
          exclude: "*.json,*.md,dist/**"
```

## 🤝 Attribution & License

This project is a significant evolution of the original [ai-codereviewer](https://github.com/villesau/ai-codereviewer) by [Ville Saukkonen](https://github.com/villesau), originally released under MIT License.

### Original Attribution
- **Original Author**: Ville Saukkonen ([@villesau](https://github.com/villesau))
- **Original Project**: [ai-codereviewer](https://github.com/villesau/ai-codereviewer)
- **Original License**: MIT License (2023)

### v2 Evolution
- **v2 Author**: Jon Price ([@jon-the-dev](https://github.com/jon-the-dev))
- **v2 Enhancements**: Complete architectural redesign, security improvements, enterprise features
- **v2 License**: MIT License (2025) - includes original attribution

Both original and modified works are released under the MIT License.

---

**Made with ❤️ by [Jon Price](https://github.com/jon-the-dev) | Evolved from the excellent work by [Ville Saukkonen](https://github.com/villesau)**
