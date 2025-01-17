
/**
 * Formats an array of program variables into an object.
 *
 * @param variables - An array of strings where each string is in the format "key=value".
 * @returns An object where each key is a program variable name and each value is the corresponding value.
 */
export const formatProgramVariables = (variables: string[]) => {
  return variables.reduce((state, arg) => {
    const [key, value] = arg.split('=');
  
    return { ...state, [key]: value };
  }, {});
}