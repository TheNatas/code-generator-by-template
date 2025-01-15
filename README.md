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
- <code>autocode [domainName] [extraVariables]</code>

##### <code>[domainName]</code> (required)
The domain name stands for the name of the new element to create on the structure. For example, if one wants to create a CRUD for tasks in a kanban project, they could use <code>autocode tasks</code> to generate the files. That would create the folders as specified on the <code>structure</code> configuration, naming the files following the specified name pattern changing the "[template]" placeholder for the <code>domainName</code>.

##### <code>[parentFolder]/[domainName]</code> (optional)
If one wants to create a new element on the structure nested in a parent folder, this can be specified by adding the parent folder's name before the domain name. For example, if one wants to create a CRUD for task kinds in a kanban project and they want to place it inside the tasks folder, they could use <code>autocode tasks/taskKinds</code>. That would create the folders as specified on the <code>structure</code> configuration looking for a folder named tasks on the layer before the files. For example, considering it is a DDD project, the presentation layer would be generated as:

- presentation
  - routes
    - tasks
      taskKinds.routes.ts

### Process explanation

The script will go through the specified structure (in the config file), create the folders that don't exist