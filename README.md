# code-generator-by-template
Automate your coding process through auto generated code by command lines.

# Usage

### Base command
- <code>generate [pathToFileToCreate] [pathToTemplateFile] [variables]</code>

##### <code>[pathToFileToCreate]</code> (required)
- Ex.: <code>tasks/taskKinds/taskKinds.routes.ts</code>
If one wants to create a new file on the project nested in a parent folder, this can be specified by adding the parent folder's name before the file name. For example, if one wants to create a CRUD for task kinds in a kanban project and they want to place it inside the tasks folder, they could use <code>generate tasks/taskKinds/taskKinds.routes.ts</code>. That would create the folders as:

- tasks
  - taskKinds
    taskKinds.routes.ts

##### <code>[pathToTemplateFile]</code> (optional)
- Ex.: <code>templates/template.test.ts</code>
If provided, should point to the path of the template to be used on the file creation. If not provided, by default, it looks for a folder named "templates" on the root folder and a file with the same name inputted file name.

##### <code>[variables]</code> (optional)
Ex.: <code>camelCase=Test plural=tests</code>
Variables to be used on the template file. It should have the same key as specified on the template file for it to work.

### Template files
The template files should be text (.txt) files, with the parameters placeholders under square brackets ([]).

### Process explanation

The script will receive a path (ex.: tests/new-test.ts) and check if the folders on this path exist. If they don't, they will be created. If they exist, it will proceed to create the file, following a template. The template path can be specified on the command or use the default behaviour (which is to use the template file in a folder named "templates"). The template may have placeholders, which then may be provided in the template and the command line args.

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