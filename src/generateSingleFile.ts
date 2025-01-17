#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { splitExtensionFromFileName, formatProgramVariables } from './utils';
import { 
  INPUT_KEY_VALUE_SEPARATOR,
  INPUT_PATH_SEPARATOR,
  TEMPLATE_FILE_EXTENSION,
  TEMPLATES_FOLDER 
} from './consts';
import { formatTextFromParameters } from './utils/text/formatTextFromParameters';

const programArgs = process.argv.slice(2);

if (programArgs.length < 1) {
  throw new Error('Usage: generate <structure> [templatePath] [extraArgs]');
}

const { inputtedStructureParam, inputtedTemplatePath, extraArgs } = programArgs.reduce((state, arg, index) => {
  if (index === 0) {
    return { ...state, inputtedStructureParam: arg };
  }
  if (index === 1 && !arg.includes(INPUT_KEY_VALUE_SEPARATOR)) {
    return { ...state, inputtedTemplatePath: arg };
  }
  else {
    return { ...state, extraArgs: [...state.extraArgs || [], arg] };
  }
}, {} as { inputtedStructureParam: string, inputtedTemplatePath?: string, extraArgs?: string[] });

const formattedExtraArgs = formatProgramVariables(extraArgs);

const inputtedStructure = inputtedStructureParam.split(INPUT_PATH_SEPARATOR);

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
    path.join(process.cwd(), ...inputtedTemplatePath.split(INPUT_PATH_SEPARATOR)) :
    path.join(process.cwd(), TEMPLATES_FOLDER, fileName + TEMPLATE_FILE_EXTENSION), 
  'utf8'
);

const createFile = (fileNameWithExtension: string, templateFile: string) => {
  fs.writeFileSync(
    path.join(currentPath, fileNameWithExtension), 
    formatTextFromParameters(
      templateFile, 
      formattedExtraArgs
    )
  );
};
createFile(
  fileNameWithExtension, 
  templateFile
);