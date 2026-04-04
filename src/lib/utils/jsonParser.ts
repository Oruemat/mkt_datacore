/** Extract JSON objects from a string that may contain markdown or mixed content */
export function findJsonBlocks(text: string): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) {
      results.push(parsed);
      return results;
    }
  } catch {
    // not pure JSON
  }

  const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)```/g;
  let match;
  while ((match = fenceRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (typeof parsed === "object" && parsed !== null) {
        results.push(parsed);
      }
    } catch {
      // skip
    }
  }

  if (results.length === 0) {
    let depth = 0;
    let start = -1;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (text[i] === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          try {
            const parsed = JSON.parse(text.slice(start, i + 1));
            if (typeof parsed === "object" && parsed !== null) {
              results.push(parsed);
            }
          } catch {
            // skip
          }
          start = -1;
        }
      }
    }
  }

  return results;
}
