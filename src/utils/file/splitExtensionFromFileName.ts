export const splitExtensionFromFileName = (wholeFileName: string): { fileName: string, extension: string } => {
  const extension = wholeFileName.split('.').slice(-1)[0];
  const fileName = wholeFileName.split('.').slice(0, -1).join('.');

  return { fileName, extension };
};