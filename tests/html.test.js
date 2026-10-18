import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeJsonForScript } from '../site/src/utils/html.js';

describe('HTML and JSON escaping', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml('<script>alert("XSS & \'attack\'")</script>')).toBe(
      '&lt;script&gt;alert(&quot;XSS &amp; &#39;attack&#39;&quot;)&lt;/script&gt;'
    );
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('escapes closing script tags in JSON strings', () => {
    const raw = { comment: '</script><script>alert(1)</script>' };
    const serialized = escapeJsonForScript(raw);
    expect(serialized).not.toContain('</script>');
    expect(serialized).toContain('\\u003c/script\\u003e');
    // Ensure it can be parsed back correctly
    const parsed = JSON.parse(serialized);
    expect(parsed.comment).toBe('</script><script>alert(1)</script>');
  });
});
