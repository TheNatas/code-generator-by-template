import fs from 'fs';
import path from 'path';
import { splitExtensionFromFileName } from './utils/file/splitExtensionFromFileName';

const [pathToScript, ...args] = process.argv.slice(1);

const inputtedStructure = args[0].split('/');

const [parentFolders, domainName] = [
  inputtedStructure.slice(0, -1), 
  inputtedStructure[inputtedStructure.length - 1]
];

// import config from '../autocode.config.json';
import { tradePlaceholderForValue } from './utils/text/tradePlaceholdersForValue';

let count = 0;

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

// createNecessaryFolders(process.cwd(), config.structure);