/**
 * parseAutoComplete
 *
 * The endpoint returns a text/javascript JSONP response:
 *
 *   window.google.ac.h(["react js", [
 *     ["react js",                          0, [512]],
 *     ["react js interview questions",       0, [512]],
 *     ["react js tutorial",                 0, [512]],
 *     ...
 *   ], {"k":1,"q":"..."}])
 *
 * Structure after stripping the JSONP wrapper:
 *   [0]  query string          – ignored
 *   [1]  suggestions array     – what we want
 *   [2]  metadata object       – ignored
 *
 * Each suggestion is a tuple: [text, rank, [type], ...]
 * We only need index [0] of each tuple.
 *
 * Stripping strategy: use the outermost `(` and `)` as boundaries.
 */
export function parseAutoComplete(text: string): string[] | false {
  try {
    const start = text.indexOf('(');
    const end = text.lastIndexOf(')');
    if (start === -1 || end === -1 || end <= start) return false;

    // Everything between the outermost parentheses is valid JSON
    const parsed: any[] = JSON.parse(text.slice(start + 1, end));

    // root[1] is the suggestions array
    const suggestions: any[] = parsed[1];
    if (!Array.isArray(suggestions)) return false;

    // Each entry is [suggestionText, rank, ...] — grab index [0]
    return suggestions
      .map((s: any[]) => s[0])
      .filter((s): s is string => typeof s === 'string' && s.length > 0);
  } catch {
    return false;
  }
}
