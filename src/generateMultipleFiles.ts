#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { formatTextFromParameters, splitExtensionFromFileName } from "./utils";
import { DEFAULT_DESIGN_PATTERN_FILE_PATH, INPUT_KEY_VALUE_SEPARATOR, INPUT_OPTIONAL_ARG_PREFFIX, INPUT_PATH_SEPARATOR, PLACEHOLDER_REGEX, TEMPLATE_FILE_EXTENSION, TEMPLATES_FOLDER } from "./consts";

const programArgs = process.argv.slice(2);

const {
  parentFolders: inputtedParentFolders, 
  templateFolderPath: inputtedTemplateFolderPath, 
  pathToDesignPatternFile: inputtedPathToDesignPatternFile, 
  extraArgs
} = programArgs.reduce((state, arg) => {
  const [argKey, argValue] = arg.split(INPUT_KEY_VALUE_SEPARATOR);
  if (arg.includes(INPUT_OPTIONAL_ARG_PREFFIX)) {
    return { ...state, [argKey.replace(INPUT_OPTIONAL_ARG_PREFFIX, '')]: argValue };
  } else {
    return { ...state, extraArgs: {...state.extraArgs, [argKey]: argValue } };
  }
}, {} as {
  parentFolders?: string, 
  templateFolderPath?: string, 
  pathToDesignPatternFile?: string, 
  extraArgs?: { [key: string]: string }
});

const parentFolders = inputtedParentFolders ? inputtedParentFolders.split(INPUT_PATH_SEPARATOR) : [];

const templateFolderPath = inputtedTemplateFolderPath ? 
  path.join(process.cwd(), ...inputtedTemplateFolderPath.split(INPUT_PATH_SEPARATOR)) :
  path.join(process.cwd(), TEMPLATES_FOLDER);

const pathToDesignPatternFile = inputtedPathToDesignPatternFile ?
  path.join(process.cwd(), ...inputtedPathToDesignPatternFile.split(INPUT_PATH_SEPARATOR)) :
  path.join(process.cwd(), DEFAULT_DESIGN_PATTERN_FILE_PATH);

const designPatternFile = fs.readFileSync(pathToDesignPatternFile, 'utf8');
const designPattern = JSON.parse(designPatternFile);

const createStructureItems = (currentPath: string, entryContent: {} | string[] | string) => {
  const currentPathDirectoryItems = fs.readdirSync(currentPath, { withFileTypes: true });

  (
    Array.isArray(entryContent) ? 
      entryContent.map((item: string) => [item]) : 
      Object.entries(entryContent)
  ).forEach(([itemName, itemContent]) => {
    const placeholdersInItemName = itemName.match(PLACEHOLDER_REGEX);
    const itemNameHasPlaceholders = placeholdersInItemName && placeholdersInItemName.length > 0;

    const hasParentFolders = parentFolders.length > 0;
    const currentPathHasParentFolders = currentPath.includes(path.join(...parentFolders));

    if (itemNameHasPlaceholders && hasParentFolders && !currentPathHasParentFolders) {
      createStructureItems(
        currentPath, 
        [...parentFolders].reverse().reduce(
          (state, folder) => ({ [folder]: state }), 
          { [itemName]: itemContent } as {}
        )
      );
    } else {
      const isFile = !itemContent;

      const itemNameWithoutPlaceholders = itemNameHasPlaceholders ? 
        formatTextFromParameters(itemName, extraArgs) : 
        itemName;
      const { fileName: itemNameWithoutExtension, extension } = isFile ? 
        splitExtensionFromFileName(itemNameWithoutPlaceholders) : 
        { fileName: itemNameWithoutPlaceholders, extension: '' };

      const itemExists = currentPathDirectoryItems.some(
        item => item.name === itemNameWithoutExtension + (isFile ? '.' + extension : '')
      );
      if (!itemExists) {
        if (isFile) {
          const templateFile = fs.readFileSync(
            path.join(templateFolderPath, splitExtensionFromFileName(itemName).fileName + TEMPLATE_FILE_EXTENSION), 
            'utf8'
          );

          fs.writeFileSync(
            path.join(currentPath, itemNameWithoutExtension + '.' + extension), 
            formatTextFromParameters(templateFile, extraArgs)
          );
        } else {
          fs.mkdirSync(path.join(currentPath, itemNameWithoutExtension));
        }
      }

      if (itemContent && ((Array.isArray(itemContent) ? itemContent : Object.keys(itemContent)).length > 0)) {
        createStructureItems(path.join(currentPath, itemNameWithoutExtension), itemContent as {});
      }
    }
  });
}

createStructureItems(process.cwd(), designPattern);