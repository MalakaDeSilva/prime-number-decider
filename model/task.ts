export type TaskType = {
  taskId: string;
  number: number;
  upperLimit: number;
  lowerLimit: number;
  status: string;
};

export class Task implements TaskType {
  taskId: string;
  number: number;
  upperLimit: number;
  lowerLimit: number;
  status: string;

  constructor(
    taskId: string,
    number: number,
    upperLimit: number,
    lowerLimit: number,
    status: string
  ) {
    this.taskId = taskId;
    this.number = number;
    this.upperLimit = upperLimit;
    this.lowerLimit = lowerLimit;
    this.status = status;
  }
}
