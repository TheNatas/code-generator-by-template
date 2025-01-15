import fs from 'fs';
import path from 'path';

const [pathToScript, ...args] = process.argv.slice(1);

const inputtedStructure = args[0].split('/');

const [parentFolders, domainName] = [
  inputtedStructure.slice(0, -1), 
  inputtedStructure[inputtedStructure.length - 1]
];

import config from '../autocode.config.json';

const createNecessaryFolders = (currentPath: string, entryContent: {} | [] | string) => {
  const currentPathDirectoryItems = fs.readdirSync(currentPath, { withFileTypes: true });

  (
    Array.isArray(entryContent) ? 
      entryContent.map((item) => [item]) : 
      Object.entries(entryContent)
  ).forEach(([itemName, itemContent]) => {
    const isTemplate = itemName === '[template]';

    const currentPathHasParentFolders = currentPath.includes(parentFolders.join('/'));
    if (isTemplate && parentFolders.length > 0 && !currentPathHasParentFolders) {
      createNecessaryFolders(
        currentPath, 
        [...parentFolders].reverse().reduce(
          (state, folder) => ({ [folder]: state }), 
          { "[template]": itemContent } as {}
        )
      );
    } else {
      const itemNameToUse = isTemplate ? itemName.replace('[template]', domainName) : itemName;

      const itemExists = currentPathDirectoryItems.some(
        item => /*item.isDirectory() &&*/ item.name === itemNameToUse
      );
      if (!itemExists) {
        const isFile = !itemContent;
        if (isFile) {
          fs.writeFileSync(
            path.join(currentPath, itemNameToUse), 
            '' // TODO: Add template content
          );
        } else {
          fs.mkdirSync(currentPath + '/' + itemNameToUse);
        }
      }

      if ((Array.isArray(entryContent) ? entryContent : Object(itemContent).keys()).length > 0) {
        createNecessaryFolders(currentPath + '/' + itemNameToUse, itemContent as {});
      }
    }
  });
}

createNecessaryFolders(process.cwd(), config.structure);