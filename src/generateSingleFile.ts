#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { splitExtensionFromFileName, tradePlaceholderForValue } from './utils';
import { 
  PLACEHOLDER_ESCAPE_CHARACTER, 
  PLACEHOLDER_REGEX, 
  TEMPLATES_FOLDER 
} from './consts';

const [inputtedStructureParam, inputtedTemplatePath, ...extraArgs] = process.argv.slice(2);

const formattedExtraArgs = extraArgs.reduce((state, arg) => {
  const [key, value] = arg.split('=');

  return { ...state, [key]: value };
}, {});

const inputtedStructure = inputtedStructureParam.split('/');

const [parentFolders, fileNameWithExtension] = [
  inputtedStructure.slice(0, -1), 
  inputtedStructure[inputtedStructure.length - 1]
];

let currentPath = process.cwd();

const createParentFolders = (parentFolders: string[]) => {
  parentFolders.forEach(folder => {
    const currentPathDirectoryItems = fs.readdirSync(currentPath, { withFileTypes: true });
  
    const itemExists = currentPathDirectoryItems.some(
      item => item.name === folder
    );
  
    if (!itemExists) {
      fs.mkdirSync(path.join(currentPath, folder));
    }
  
    currentPath = path.join(currentPath, folder);
  });
};
createParentFolders(
  parentFolders, 
);

const { fileName } = splitExtensionFromFileName(fileNameWithExtension);

const templateFile = fs.readFileSync(
  inputtedTemplatePath ? 
    path.join(process.cwd(), ...inputtedTemplatePath.split('/')) :
    path.join(process.cwd(), TEMPLATES_FOLDER, fileName + '.txt'), 
  'utf8'
);

const formatFileFromExtraArgs = (templateFile: string, formattedExtraArgs: {}) => {
  const placeholders = templateFile.match(PLACEHOLDER_REGEX);

  if (!placeholders) {
    return templateFile;
  }

  return placeholders.reduce((state, placeholder) => {
    const formattedExtraArg = formattedExtraArgs[placeholder.slice(1, -1)];
    return state
      .replaceAll(placeholder, formattedExtraArg)
      .replaceAll(PLACEHOLDER_ESCAPE_CHARACTER + formattedExtraArg, placeholder);
  }, templateFile);
}

const createFile = (fileNameWithExtension: string, fileName: string, templateFile: string) => {
  fs.writeFileSync(
    path.join(currentPath, fileNameWithExtension), 
    formatFileFromExtraArgs(
      templateFile, 
      formattedExtraArgs
    )
  );
};
createFile(
  fileNameWithExtension, 
  fileName, 
  templateFile
);