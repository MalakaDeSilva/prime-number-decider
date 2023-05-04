export interface ParticipantType {
  nodeId: string;
  upperLimit: number;
  lowerLimit: number;
}

export interface JobType {
  id: string;
  number: number;
  participants: ParticipantType[];
  status: string;
  result: string;
}

export class Participants implements ParticipantType {
  nodeId: string;
  upperLimit: number;
  lowerLimit: number;

  constructor(nodeId: string, upperLimit: number, lowerLimit: number) {
    this.nodeId = nodeId;
    this.upperLimit = upperLimit;
    this.lowerLimit = lowerLimit;
  }
}

export class Job implements JobType {
  id: string;
  number: number;
  participants: Participants[];
  status: string;
  result: string;

  constructor(
    id: string,
    number: number,
    participants: Participants[],
    status: string,
    result: string
  ) {
    this.id = id;
    this.number = number;
    this.participants = participants;
    this.status = status;
    this.result = result;
  }
}
