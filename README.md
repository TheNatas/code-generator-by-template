# autocode
Automate your coding process through auto generated code by command lines.

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

# Usage

### Base command
- <code>autocode [pathToFileToCreate] [pathToTemplateFile] [extraVariables]</code>

##### <code>[pathToFileToCreate]</code> (required)
If one wants to create a new element on the structure nested in a parent folder, this can be specified by adding the parent folder's name before the domain name. For example, if one wants to create a CRUD for task kinds in a kanban project and they want to place it inside the tasks folder, they could use <code>autocode tasks/taskKinds</code>. That would create the folders as specified. For example, considering it is a DDD project, the presentation layer would be generated as:

- tasks
  taskKinds.routes.ts

##### <code>[pathToTemplateFile]</code> (optional)
Ex.: <code>templates/template.test.ts</code>
If provided, should point to the path of the template to be used on the file creation. If not provided, by default, it looks for a folder named "templates" on the root folder and a file with the same name inputted file name.

##### <code>[extraVariables]</code> (optional)
Ex.: <code>camelCase=Test plural=tests</code>
Variables to be used on the template file. It should have the same key as specified on the template file for it to work.

### Process explanation

The script will receive a path (ex.: tests/new-test.ts) and check if the folders on this path exist. If they don't, they will be created. If they exists, it will proceed to create the file, following a template. The template path can be specified on the command or use the default behaviour. The template may have placeholders, such as "template", which is the default placeholder for the file name. Other placeholders may be provided in the template and the command line args.