# dc-node
## Prerequisites

This project uses [***pnpm***](https://pnpm.io/) project manager to manage node modules.

## How to run

Service Registry needs to be started first. When new processes are created, they will be able to register themselves on the registry. By default Service Registry will be started on port 8000. By double clicking on ***start.cmd*** file will create 6 process on ports,

- 3001
- 4001
- 5001
- 6001
- 7001
- 9001

### Step 1: Start Service Registry

Service Registry can be simply started by double clicking on ***start.cmd*** file inside Service Registry project or executing,
```
pnpm start
```
command on terminal/command prompt opened inside Service Registry project directory. By default, port **8000** will be selected to run the Service Registry.

To select a different port, below command can be used.
```
pnpm start {PORT}
```
 Service Registry: [https://{host}:{port}/get-services](https://{host}:{port}/get-services)
 
### Step 2: Start Nodes

By simply double clicking on  ***start.cmd*** file, 6 processes can be started. ***start.cmd*** script is configured to start 6 processes on 6 predefined ports. Or running,
```
pnpm start {port}
```
command on a terminal/command prompt opened inside ***dc-node*** project will also create a process on the given port. 

Once the nodes are started, find the _learner_ node from the service registry ([https://{host}:{port}/get-services](https://{host}:{port}/get-services)). 

> Get current tasks: [https://{learner-host}:{learner-port}/api/learner/get-tasks](https://{host}:{port}/api/learner/get-tasks)

## .env format
>HOST={HOST}
>PORT={PORT}
>SERVICE_REGISTRY=http://{HOST}:{PORT}