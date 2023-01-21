# Password Management Browser Extension

**_Note:_** This repository is a **Monorepo** using `yarn workspaces`.

## Developers guide

### Setup project on local machine

1. Run `git clone <HTTPS_URL_of_repo>` on command line.
2. In project root directory run `yarn` or `yarn install` to setup all dependencies.

### Projects inside this monorepo

1. **Extension** contains the files for building browser extension files using React 18.
2. **Sever** contains the files for the express.js server.

### Accessing the project scripts

#### Specific project

##### Recommended Method

Change your directory to the specific project's root file using `cd packages/<dir>` and run any script using `yarn <script_name>`

##### Not Recommended Method

Use the command `yarn <workspace_name> <script_name>`.\
Example - use `yarn extension build` to build the extension files.\
**_Note:_** The above command only works when `"<workspace_name>": "yarn workspace <workspace_name>"` script is added to the `package.json` file. This is not recommended as it could create a path error while running the script.

#### All Projects

Use the command `yarn workspaces <script_name>` to execute the `<script_name>` script for all projects.\
Example - use `yarn workspaces lint` to lint all the code files.
