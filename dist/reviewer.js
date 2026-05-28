#!/usr/bin/env node

/**
 * auto-pr-review-action — Automated PR Review Engine
 *
 * Checks code style, bug patterns, security vulnerabilities, and performance issues.
 * Outputs annotations in GitHub Actions format.
 */

const fs = require('fs');
const path = require('path');

// --------------- Rule Definitions ---------------

const RULES = {
  // Code Style
  'console-log': {
    category: 'style',
    severity: 'warning',
    pattern: /console\.(log|debug|dir)\(/,
    message: 'Console statement left in code. Consider removing or replacing with a proper logger.',
    filePattern: /\.(js|ts|py|go|rs)$/
  },
  'long-line': {
    category: 'style',
    severity: 'info',
    pattern: /^.{121,}$/,
    message: 'Line exceeds 120 characters. Consider breaking it up for readability.',
    filePattern: /\.(js|ts|py|go|rs|java|cs)$/
  },
  'todo-left': {
    category: 'style',
    severity: 'warning',
    pattern: /TODO|FIXME|HACK|XXX/,
    message: 'TODO/FIXME/HACK comment found. Should be addressed before merging.',
    filePattern: /.*/
  },

  // Bug Patterns
  'empty-catch': {
    category: 'bug',
    severity: 'error',
    pattern: /catch\s*\([^)]*\)\s*\{[\s]*\}/,
    message: 'Empty catch block silently swallows errors. Handle or re-throw the exception.',
    filePattern: /\.(js|ts|java|cs)$/
  },
  'assignment-in-condition': {
    category: 'bug',
    severity: 'warning',
    pattern: /if\s*\([^)]*=[^=]/,
    message: 'Possible assignment in condition. Did you mean == or ===?',
    filePattern: /\.(js|ts|java|c|cs)$/
  },
  'null-deref': {
    category: 'bug',
    severity: 'error',
    pattern: /\.[ \t]*\n[ \t]*\.(?!\.)/,
    message: 'Possible method chain on null/undefined. Ensure safe access.',
    filePattern: /\.(js|ts)$/
  },
  'hardcoded-secret': {
    category: 'security',
    severity: 'error',
    pattern: /(?:password|secret|api[_-]?key|token|auth)[\s]*[:=][\s]*['"][^'"]+['"]/i,
    message: 'Possible hardcoded credential. Use environment variables or secrets manager.',
    filePattern: /\.(js|ts|py|go|rs|yaml|yml|json|env)$/
  },
  'sql-injection': {
    category: 'security',
    severity: 'error',
    pattern: /db\.(query|execute|run)\([^)]*`.*\$\{/,
    message: 'Possible SQL injection via template literals. Use parameterized queries.',
    filePattern: /\.(js|ts)$/
  },
  'eval-usage': {
    category: 'security',
    severity: 'error',
    pattern: /\beval\(/,
    message: 'Use of eval() is a security risk. Consider safer alternatives.',
    filePattern: /\.(js|ts)$/
  },
  'unsafe-inner-html': {
    category: 'security',
    severity: 'warning',
    pattern: /innerHTML\s*=/,
    message: 'Setting innerHTML can lead to XSS. Consider textContent or sanitize input.',
    filePattern: /\.(js|ts|html)$/
  },

  // Performance
  'nested-loop': {
    category: 'performance',
    severity: 'info',
    pattern: /for\s*\([^)]+\)[\s\S]{0,100}for\s*\(/,
    message: 'Nested loop detected — potential O(n²) complexity. Consider optimizing.',
    filePattern: /\.(js|ts|py|go|rs|java)$/
  },
  'synchronous-file-read': {
    category: 'performance',
    severity: 'info',
    pattern: /fs\.(readFileSync|writeFileSync)\(/,
    message: 'Synchronous file I/O in async context may block the event loop.',
    filePattern: /\.(js|ts)$/
  },
  'large-payload': {
    category: 'performance',
    severity: 'info',
    message: 'Large JSON/file payload may impact performance. Consider streaming or pagination.',
    filePattern: /\.json$/
  },
  'unused-import': {
    category: 'style',
    severity: 'info',
    message: 'Unused import/variable detected. Clean up dead code.',
    // Simple heuristic: track exports and see if they're used
    filePattern: /\.(js|ts)$/
  }
};

// --------------- Analyzer ---------------

function analyzeFile(filePath, content) {
  const results = [];
  const ext = path.extname(filePath).toLowerCase();
  const lines = content.split('\n');

  for (const [ruleName, rule] of Object.entries(RULES)) {
    // Check if rule applies to this file type
    if (rule.filePattern && !rule.filePattern.test(filePath) && !rule.filePattern.test(`.${ext}`)) {
      continue;
    }

    if (rule.pattern) {
      lines.forEach((line, idx) => {
        if (rule.pattern.test(line)) {
          results.push({
            rule: ruleName,
            category: rule.category,
            severity: rule.severity,
            file: filePath,
            line: idx + 1,
            message: rule.message,
            code: line.trim()
          });
        }
      });
    } else if (ruleName === 'large-payload' && content.length > 100000) {
      // Check large files
      results.push({
        rule: ruleName,
        category: rule.category,
        severity: rule.severity,
        file: filePath,
        line: 1,
        message: rule.message,
        code: `${(content.length / 1024).toFixed(1)} KB`
      });
    }
  }

  return results;
}

function walkDir(dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
          files.push(...walkDir(fullPath));
        }
      } else {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // Skip inaccessible directories
  }
  return files;
}

function generateReview(allResults) {
  // Group by severity
  const errors = allResults.filter(r => r.severity === 'error');
  const warnings = allResults.filter(r => r.severity === 'warning');
  const infos = allResults.filter(r => r.severity === 'info');

  let output = `## 🤖 Auto PR Review Results\n\n`;

  if (allResults.length === 0) {
    output += `✅ **No issues found** — code looks clean!\n\n`;
    return output;
  }

  output += `### 📊 Summary\n\n`;
  output += `| Severity | Count |\n|----------|-------|\n`;
  output += `| 🔴 Error | ${errors.length} |\n`;
  output += `| 🟡 Warning | ${warnings.length} |\n`;
  output += `| 🔵 Info | ${infos.length} |\n`;
  output += `| **Total** | **${allResults.length}** |\n\n`;

  if (errors.length > 0) {
    output += `### 🔴 Errors (must fix)\n\n`;
    errors.forEach(r => {
      output += `- **${r.rule}**: ${r.message} [${r.file}:${r.line}]\n`;
      output += `  \`\`\`\n  ${r.code}\n  \`\`\`\n`;
    });
    output += '\n';
  }

  if (warnings.length > 0) {
    output += `### 🟡 Warnings (should fix)\n\n`;
    warnings.forEach(r => {
      output += `- **${r.rule}**: ${r.message} [${r.file}:${r.line}]\n`;
      output += `  \`${r.code}\`\n`;
    });
    output += '\n';
  }

  if (infos.length > 0) {
    output += `### 🔵 Suggestions\n\n`;
    infos.forEach(r => {
      output += `- **${r.rule}**: ${r.message} [${r.file}:${r.line}]\n`;
    });
    output += '\n';
  }

  output += `---\n\n`;
  output += `_Powered by [auto-pr-review-action](https://github.com/shuchengle/auto-pr-review-action) — part of [SCL339](https://github.com/shuchengle) project suite._\n`;

  return output;
}

// --------------- GitHub Actions helpers ---------------

function githubAnnotation(result) {
  const severityMap = {
    'error': 'error',
    'warning': 'warning',
    'info': 'notice'
  };

  return `::${severityMap[result.severity] || 'notice'} file=${result.file},line=${result.line},title=${result.rule}::${result.message}`;
}

// --------------- Main ---------------

function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] || process.env.GITHUB_WORKSPACE || '.';
  const outputFile = args[1];

  console.log(`🔍 Scanning: ${targetDir}\n`);

  const files = walkDir(targetDir);
  const allResults = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const results = analyzeFile(file, content);
      allResults.push(...results);

      // Emit GitHub annotations
      for (const result of results) {
        console.log(githubAnnotation(result));
      }
    } catch (e) {
      // Skip unreadable files
    }
  }

  // Sort by severity
  const severityOrder = { error: 0, warning: 1, info: 2 };
  allResults.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

  const review = generateReview(allResults);

  console.log('\n' + review);

  // Write review to file for step output
  if (outputFile) {
    fs.writeFileSync(outputFile, review);
    console.log(`Review saved to ${outputFile}`);
  }

  // Set GitHub Action output
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `review=${review}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `issues=${allResults.length}\n`);
  }

  // Exit with error code if there are errors
  const errorCount = allResults.filter(r => r.severity === 'error').length;
  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

main();
