import { PLACEHOLDER_ESCAPE_CHARACTER, PLACEHOLDER_REGEX } from "../../consts";

/**
 * For each received placeholder, replaces all occurrences of it in the given text with the corresponding value from the parameters object,
 * except when prefixed with the escape character ('$').
 *
 * @param text - The text in which to perform the replacements.
 * @param parameters - An object containing placeholder-value pairs for replacement.
 * @returns The modified text with the placeholders replaced by their corresponding values and vice versa.
 */
export const formatTextFromParameters = (text: string, parameters: { [key: string]: string }) => {
  const placeholders = text.match(PLACEHOLDER_REGEX);

  if (!placeholders) {
    return text;
  }

  return placeholders.reduce((formattedText, placeholder) => {
    const formattedExtraArg = parameters[placeholder.slice(1, -1)];
    return formattedText
      .replaceAll(placeholder, formattedExtraArg)
      .replaceAll(PLACEHOLDER_ESCAPE_CHARACTER + formattedExtraArg, placeholder);
  }, text);
}