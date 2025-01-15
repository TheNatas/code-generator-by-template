
/**
 * Replaces all occurrences of a placeholder in the given text with a specified value,
 * and then replaces all occurrences of the value prefixed with the scape character ('$') back to the placeholder.
 *
 * @param text - The text in which to perform the replacements.
 * @param value - The value to replace the placeholder with.
 * @param placeholder - The placeholder to be replaced by the value.
 * @returns The modified text with the placeholder replaced by the value and vice versa.
 */
export const tradePlaceholderForValue = (text: string, value: string, placeholder: string) => {
  return text.replaceAll(placeholder, value).replaceAll('$' + value, placeholder);
};