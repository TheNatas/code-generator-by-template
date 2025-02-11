# code-generator-by-template
Automate your coding process through auto generated code by command lines.

# Description
There are two different usages for this library. It's possible to generate a single file or a whole structure based off the templates.

# Usage

### Base command (generate single file)
<code>generate-file <pathToFileToCreate> [pathToTemplateFile] [variables]</code>

##### <code>\<pathToFileToCreate\></code> (required)
Ex.: <code>tasks/taskKinds/taskKinds.routes.ts</code>
Path for the file to be created. If one wants to create a new file on the project nested in a parent folder, this can be specified by adding the parent folder's name before the file name. For example, if one wants to create a CRUD for task kinds in a kanban project and they want to place it inside the tasks folder, they could use <code>generate tasks/taskKinds/taskKinds.routes.ts</code>. That would create the folders as:

```
- tasks
  - taskKinds
    taskKinds.routes.ts
```

##### <code>[pathToTemplateFile]</code> (optional)
Ex.: <code>templates/template.test.ts</code>
If provided, should point to the path of the template to be used on the file creation. If not provided, by default, it looks for a folder named "templates" on the root folder and a file with the same name inputted file name.

##### <code>[variables]</code> (optional)
Ex.: <code>camelCase=Test plural=tests</code>
Variables to be used on the template file. It should have the same key as specified on the template file for it to work.

### Base command (generate multiple files)
<code>generate-structure [--parentFolders] [--templateFolderPath] [--pathToDesignPatternFile] [variables]</code>

##### <code>[--parentFolders]</code> (optional)
Ex.: <code>tasks/taskKinds</code>
If one wants to create some parent folders before the folder names with placeholder, this can be specified by adding the parent folder's name before the file name. For example, if one wants to create a CRUD for task kinds in a kanban project and they want to place it inside the tasks folder, they could use <code>generate tasks/taskKinds/taskKinds.routes.ts</code>. That would create the folders as:

```
- tasks
  - taskKinds
```

##### <code>[--templateFolderPath]</code> (optional)
Ex.: <code>templates/template.test.ts</code>
If provided, should point to the path of the template folder to be used on the file creation. If not provided, by default, it looks for a folder named "templates" on the root folder.

##### <code>[--pathToDesignPatternFile]</code> (optional)
Ex.: <code>templates/code-generator-design-pattern.json</code>
If provided, should point to the path of the design pattern file. If not provided, by default, it looks for a folder named "templates" on the root folder and then a file named code-generator-design-pattern.json.

##### <code>[variables]</code> (optional)
Ex.: <code>camelCase=Test plural=tests</code>
Variables to be used on the template file. It should have the same key as specified on the template file for it to work.

### Template files
The template files should be text (.txt) files, with the parameters placeholders under square brackets ([]).

### Process explanation

##### generate-file

The script will receive a path (ex.: tests/new-test.ts) and check if the folders on this path exist. If they don't, they will be created. If they exist, it will proceed to create the file, following a template. The template path can be specified on the command or use the default behaviour (which is to use the template file in a folder named "templates"). The template may have placeholders, which then may be provided in the template and the command line args.

##### generate-structure

The script may receive some parent folders to create before the folders with placeholders on their names on the design pattern file, the path to the template folder, the path to the design pattern file and/or the variables to replace on the placeholders. The script will check the design pattern file to create the necessary folders and files that are specified there. Then, for the files, it shall look for the template files with the same name that is specified on the design pattern file. For the placeholder in the files contents and in the design patterns, it looks for the placeholders parameters that come from the program args, inputted by the user.

# Development

### Requirements
- NodeJS 20+

### Steps to run
- Install
- Compile
- Run

### Installing
- <code>yarn install</code>

### Compiling
- <code>npx tsc</code>

### Running
- <code>node dist/index.js</code>