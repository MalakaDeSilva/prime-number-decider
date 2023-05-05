export interface VoteType {
  taskId: string;
  nodeId: string;
  result: string;
}

export class Vote implements VoteType {
  taskId: string;
  nodeId: string;
  result: string;

  constructor(taskId: string, nodeId: string, result: string) {
    this.taskId = taskId;
    this.nodeId = nodeId;
    this.result = result;
  }
}
