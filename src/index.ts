// TODO: make this executable from the command line through a distinct command
import fs from 'fs';
import path from 'path';
import { splitExtensionFromFileName, tradePlaceholderForValue } from './utils';
import { DEFAULT_DESIGN_PATTERN_FILE_PATH } from './consts';

const args = process.argv.slice(2);

const inputtedStructure = args[0].split('/');
const inputtedPathToConfigFile = args[1];

const [parentFolders, domainName] = [
  inputtedStructure.slice(0, -1), 
  inputtedStructure[inputtedStructure.length - 1]
];

const pathToConfigFile = inputtedPathToConfigFile ?
  path.join(process.cwd(), ...inputtedPathToConfigFile.split('/')) :
  path.join(process.cwd(), DEFAULT_DESIGN_PATTERN_FILE_PATH);

const configFile = fs.readFileSync(pathToConfigFile, 'utf8');
const config = JSON.parse(configFile);

const createNecessaryFolders = (currentPath: string, entryContent: {} | string[] | string) => {
  const currentPathDirectoryItems = fs.readdirSync(currentPath, { withFileTypes: true });

  (
    Array.isArray(entryContent) ? 
      entryContent.map((item: string) => [item]) : 
      Object.entries(entryContent)
  ).forEach(([itemName, itemContent]) => {
    const isTemplate = itemName.includes('[template]');

    const hasParentFolders = parentFolders.length > 0;
    const currentPathHasParentFolders = currentPath.includes(path.join(...parentFolders));

    if (isTemplate && hasParentFolders && !currentPathHasParentFolders) {
      createNecessaryFolders(
        currentPath, 
        [...parentFolders].reverse().reduce(
          (state, folder) => ({ [folder]: state }), 
          { "[template]": itemContent } as {}
        )
      );
    } else {
      const isFile = !itemContent;

      const itemNameWithoutPlaceholders = isTemplate ? 
        itemName.replace('[template]', domainName) : 
        itemName;
      const { fileName: itemNameWithoutExtension, extension } = isFile ? 
        splitExtensionFromFileName(itemNameWithoutPlaceholders) : 
        { fileName: itemNameWithoutPlaceholders, extension: '' };

      const itemExists = currentPathDirectoryItems.some(
        item => item.name === itemNameWithoutExtension + (isFile ? '.' + extension : '')
      );
      if (!itemExists) {
        if (isFile) {
          const templateFile = fs.readFileSync(path.join(process.cwd(), 'templates', splitExtensionFromFileName(itemName).fileName + '.txt'), 'utf8');

          fs.writeFileSync(
            path.join(currentPath, itemNameWithoutExtension + '.' + extension), 
            tradePlaceholderForValue(templateFile, domainName, '[template]')
          );
        } else {
          fs.mkdirSync(path.join(currentPath, itemNameWithoutExtension));
        }
      }

      if (itemContent && ((Array.isArray(itemContent) ? itemContent : Object.keys(itemContent)).length > 0)) {
        createNecessaryFolders(path.join(currentPath, itemNameWithoutExtension), itemContent as {});
      }
    }
  });
}

createNecessaryFolders(process.cwd(), config.structure);