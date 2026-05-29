# Auto PR Review Action

> 🤖 **Automated PR Code Review using AI Rules** — Catch code style issues, bug patterns, security vulnerabilities, and performance problems before they hit production.

[![GitHub](https://img.shields.io/github/v/release/SCL339/auto-pr-review-action)](https://github.com/SCL339/auto-pr-review-action/releases)
[![GitHub](https://img.shields.io/github/license/SCL339/auto-pr-review-action)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/SCL339/auto-pr-review-action/pulls)

---

## 🚀 Features

- **Zero dependencies** — pure Node.js composite action, no npm install needed
- **15+ built-in rules** covering code style, bugs, security, and performance
- **GitHub Checks integration** — annotations on the diff and a PR comment summary
- **Customizable** — add your own rules via config file
- **Fast** — typically completes in under 10 seconds

## 📦 Usage

### Quick start

Add this workflow to your repo (`.github/workflows/pr-review.yml`):

```yaml
name: PR Review
on:
pull_request:
types: [opened, synchronize]

jobs:
review:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
-      uses: SCL339/auto-pr-review-action@v1
with:
token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `token` | GitHub token for posting PR comments | No | `${{ github.token }}` |
| `target` | Directory to scan (relative to workspace root) | No | `.` |
| `fail-on-error` | Fail the workflow if errors are found | No | `true` |
| `config` | Path to custom rules config file | No | `""` |

## 🧩 Built-in Rules

### 🔴 Errors (must fix)
| Rule | Description |
|------|-------------|
| `empty-catch` | Empty catch block swallows errors |
| `null-deref` | Possible null/undefined dereference |
| `hardcoded-secret` | Credentials hardcoded in source |
| `sql-injection` | SQL injection via template literals |
| `eval-usage` | Security risk from eval() |

### 🟡 Warnings (should fix)
| Rule | Description |
|------|-------------|
| `console-log` | Debug console statements left in code |
| `todo-left` | TODO/FIXME comments not addressed |
| `assignment-in-condition` | Possible = vs == mistake |
| `unsafe-inner-html` | XSS risk from innerHTML |

### 🔵 Info (suggestions)
| Rule | Description |
|------|-------------|
| `long-line` | Lines exceeding 120 characters |
| `nested-loop` | Potential O(n²) complexity |
| `synchronous-file-read` | Blocking I/O in async context |
| `large-payload` | Large files impacting performance |

## ⚙️ Custom Rules

Create a `.pr-reviewer.json` in your repo:

```json
{
"rules": [
{
"name": "no-var",
"category": "style",
"severity": "error",
"pattern": "\\bvar\\s",
"message": "Use const/let instead of var",
"files": ["*.js", "*.ts"]
}
]
}
```

## 🔗 Related SCL339 Projects

- [**scl339-skill-pack**](https://github.com/SCL339/scl339-skill-pack) — AI coding assistant skill pack with 12+ skills for Claude Code, Codex, and Cursor
- [**token-saver**](https://github.com/SCL339/scl339-token-saver) — LLM token optimization CLI tool to reduce API costs

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License