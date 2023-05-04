interface ProposerResultType {
  taskId: string;
  number: number;
  result: string;
  message: string;
  divisor: number;
  nodeId: string;
}

export class ProposerResult implements ProposerResultType {
  taskId: string;
  number: number;
  result: string;
  message: string;
  divisor: number;
  nodeId: string;

  constructor(
    taskId: string,
    number: number,
    result: string,
    message: string,
    divisor: number,
    nodeId: string
  ) {
    this.taskId = taskId;
    this.number = number;
    this.result = result;
    this.message = message;
    this.divisor = divisor;
    this.nodeId = nodeId;
  }
}
