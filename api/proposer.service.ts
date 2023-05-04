import { Task } from "../model/task";
import { ServiceType } from "../model/service";
import {
  SEND_RESULT,
  GET_ACCEPTORS,
  NODE_ID,
  NOT_PRIME,
  PRIME,
} from "../utils/Constants";
import axios from "axios";
import app from "../index";

interface ServerResponse {
  response: ServiceType[];
}

interface Result {
  result: string;
  divisor: number;
}

interface ProposerResult {
  taskId: string;
  number: number;
  result: string;
  divisor: number;
}

export function startCalculation(task: Task) {
  return new Promise<Result>((resolve, reject) => {
    let { lowerLimit, upperLimit, number } = task;
    if (lowerLimit >= upperLimit)
      reject("Lower limit shold be smaller than upper limit.");

    if (number <= 1) reject("Number should be greater than 1.");

    for (let i = lowerLimit; i < upperLimit; i++) {
      if (number % i === 0) {
        resolve({ result: NOT_PRIME, divisor: i });
        return;
      }

      if (i == upperLimit - 1) {
        resolve({ result: PRIME, divisor: -1 });
      }
    }
  });
}

export function findPrimeOrNotPrime(task: Task) {
  getAcceptors((acceptors) => {
    let acceptor = acceptors[Math.floor(Math.random() * acceptors.length)];

    startCalculation(task)
      .then((res) => {
        axios
          .post(acceptor.uri + SEND_RESULT, {
            jobId: task.taskId,
            result: res.result,
            message:
              res.result == PRIME ? "Number is Prime" : "Number is not Prime",
            divisor: res.divisor,
            nodeId: app.get(NODE_ID),
            number: task.number,
          })
          .then((res) => {
            if (res.status == 200) "Acceptor accepted the result.";
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
  });
}

function getAcceptors(callback: (acceptors: ServiceType[]) => void) {
  axios
    .get<ServerResponse>(process.env.SERVICE_REGISTRY + GET_ACCEPTORS)
    .then((res) => callback(res.data.response))
    .catch((err) => console.log(err.message));
}
