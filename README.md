1|     1|     1|# Auto PR Review Action
     2|     2|     2|
     3|     3|     3|> 🤖 **Automated PR Code Review using AI Rules** — Catch code style issues, bug patterns, security vulnerabilities, and performance problems before they hit production.
     4|     4|     4|
     5|     5|     5|[![GitHub](https://img.shields.io/github/v/release/SCL339/auto-pr-review-action)](https://github.com/SCL339/auto-pr-review-action/releases)
     6|     6|     6|[![GitHub](https://img.shields.io/github/license/SCL339/auto-pr-review-action)](LICENSE)
     7|     7|     7|[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/SCL339/auto-pr-review-action/pulls)
     8|     8|     8|
     9|     9|     9|---
    10|    10|    10|
    11|    11|    11|## 🚀 Features
    12|    12|    12|
    13|    13|    13|- **Zero dependencies** — pure Node.js composite action, no npm install needed
    14|    14|    14|- **15+ built-in rules** covering code style, bugs, security, and performance
    15|    15|    15|- **GitHub Checks integration** — annotations on the diff and a PR comment summary
    16|    16|    16|- **Customizable** — add your own rules via config file
    17|    17|    17|- **Fast** — typically completes in under 10 seconds
    18|    18|    18|
    19|    19|    19|## 📦 Usage
    20|    20|    20|
    21|    21|    21|### Quick start
    22|    22|    22|
    23|    23|    23|Add this workflow to your repo (`.github/workflows/pr-review.yml`):
    24|    24|    24|
    25|    25|    25|```yaml
    26|    26|    26|name: PR Review
    27|    27|    27|on:
    28|    28|    28|  pull_request:
    29|    29|    29|    types: [opened, synchronize]
    30|    30|    30|
    31|    31|    31|jobs:
    32|    32|    32|  review:
    33|    33|    33|    runs-on: ubuntu-latest
    34|    34|    34|    steps:
    35|    35|    35|      - uses: actions/checkout@v4
    36|    36|    36|      -      uses: SCL339/auto-pr-review-action@v1
    37|    37|    37|        with:
    38|    38|    38|          token: ${{ secrets.GITHUB_TOKEN }}
    39|    39|    39|```
    40|    40|    40|
    41|    41|    41|### Inputs
    42|    42|    42|
    43|    43|    43|| Input | Description | Required | Default |
    44|    44|    44||-------|-------------|----------|---------|
    45|    45|    45|| `token` | GitHub token for posting PR comments | No | `${{ github.token }}` |
    46|    46|    46|| `target` | Directory to scan (relative to workspace root) | No | `.` |
    47|    47|    47|| `fail-on-error` | Fail the workflow if errors are found | No | `true` |
    48|    48|    48|| `config` | Path to custom rules config file | No | `""` |
    49|    49|    49|
    50|    50|    50|## 🧩 Built-in Rules
    51|    51|    51|
    52|    52|    52|### 🔴 Errors (must fix)
    53|    53|    53|| Rule | Description |
    54|    54|    54||------|-------------|
    55|    55|    55|| `empty-catch` | Empty catch block swallows errors |
    56|    56|    56|| `null-deref` | Possible null/undefined dereference |
    57|    57|    57|| `hardcoded-secret` | Credentials hardcoded in source |
    58|    58|    58|| `sql-injection` | SQL injection via template literals |
    59|    59|    59|| `eval-usage` | Security risk from eval() |
    60|    60|    60|
    61|    61|    61|### 🟡 Warnings (should fix)
    62|    62|    62|| Rule | Description |
    63|    63|    63||------|-------------|
    64|    64|    64|| `console-log` | Debug console statements left in code |
    65|    65|    65|| `todo-left` | TODO/FIXME comments not addressed |
    66|    66|    66|| `assignment-in-condition` | Possible = vs == mistake |
    67|    67|    67|| `unsafe-inner-html` | XSS risk from innerHTML |
    68|    68|    68|
    69|    69|    69|### 🔵 Info (suggestions)
    70|    70|    70|| Rule | Description |
    71|    71|    71||------|-------------|
    72|    72|    72|| `long-line` | Lines exceeding 120 characters |
    73|    73|    73|| `nested-loop` | Potential O(n²) complexity |
    74|    74|    74|| `synchronous-file-read` | Blocking I/O in async context |
    75|    75|    75|| `large-payload` | Large files impacting performance |
    76|    76|    76|
    77|    77|    77|## ⚙️ Custom Rules
    78|    78|    78|
    79|    79|    79|Create a `.pr-reviewer.json` in your repo:
    80|    80|    80|
    81|    81|    81|```json
    82|    82|    82|{
    83|    83|    83|  "rules": [
    84|    84|    84|    {
    85|    85|    85|      "name": "no-var",
    86|    86|    86|      "category": "style",
    87|    87|    87|      "severity": "error",
    88|    88|    88|      "pattern": "\\bvar\\s",
    89|    89|    89|      "message": "Use const/let instead of var",
    90|    90|    90|      "files": ["*.js", "*.ts"]
    91|    91|    91|    }
    92|    92|    92|  ]
    93|    93|    93|}
    94|    94|    94|```
    95|    95|    95|
    96|    96|    96|## 🔗 Related SCL339 Projects
    97|    97|    97|
    98|    98|    98|- [**scl339-skill-pack**](https://github.com/SCL339/scl339-skill-pack) — AI coding assistant skill pack with 12+ skills for Claude Code, Codex, and Cursor
    99|    99|    99|- [**token-saver**](https://github.com/SCL339/scl339-token-saver) — LLM token optimization CLI tool to reduce API costs
   100|   100|   100|
   101|   101|   101|
   102|---
   103|
   104|## 🤝 赞助支持 (Sponsor)
   105|
   106|如果这个项目对你有帮助，可以请我喝杯咖啡 ☕
   107|
   108|- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
   109|- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
   110|- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目
   111|
   112|## 📄 License
   113|
   114|
   115|   102|   102|
   116|   103|   103|MIT — see [LICENSE](LICENSE)
   117|   104|   104|
   118|   105|   105|---
   119|   106|   106|
   120|   107|   107|## ☕ Sponsor
   121|   108|   108|
   122|   109|   109|If this action saves your team time in code reviews, consider supporting the project:
   123|   110|   110|
   124|   111|   111|**Alipay**: Scan the QR code or search for **shuchengle** on Alipay to sponsor.
   125|   112|   112|
   126|   113|   113|```
   127|   114|   114|支付宝扫一扫，赞助支持
   128|   115|   115|```
   129|   116|   116|
   130|   117|   117|Your support keeps the open source ecosystem thriving. Thank you! 🙏
   131|   118|   118|

---

## 🤝 赞助支持 (Sponsor)

如果这个项目对你有帮助，可以请我喝杯咖啡 ☕

- 💖 **支付宝 (Alipay)**: `18559219554` | 邮箱联系: `530765059@qq.com`
- ☁️ **DigitalOcean 联盟链接**: [免费 $200 额度](https://www.digitalocean.com/?refcode=scl339-01&utm_campaign=Referral_Invite&utm_medium=opensource&utm_source=SCL339)
- ⭐ **在 GitHub 上点 Star** 帮助更多人发现这个项目

## 📄 License
