import axios from "axios";
import {
  GET_LEARNERS,
  NOTIFY_LEARNER,
  NOT_PRIME,
  PRIME,
} from "../utils/Constants";
import { ServiceType } from "../model/service";
import { ProposerResult } from "../model/proposer_result";

interface ServerResponse {
  response: ServiceType[];
}

export function verifyResult(
  number: number,
  divisor: number,
  result: string,
  callback: () => void
) {
  let acceptorResult = number % divisor == 0 ? NOT_PRIME : PRIME;
/* 
  console.log(`${number} : ${divisor} : ${result} : ${acceptorResult}`); */

  if (result == acceptorResult) {
    callback();
  }
}

export function notifyLearner(propResult: ProposerResult) {
  getLearner((learner) => {
    axios
      .post(learner.uri + NOTIFY_LEARNER, {
        taskId: propResult.taskId,
        result: propResult.result,
        proposerId: propResult.nodeId,
      })
      .then((res) => {
        console.log(res.data.response);
      })
      .catch((err) => console.log(err));
  });
}

function getLearner(callback: (learner: ServiceType) => void) {
  axios
    .get<ServerResponse>(process.env.SERVICE_REGISTRY + GET_LEARNERS)
    .then((res) => {
      if (res.status == 200) {
        if (res.data.response.length > 0) {
          callback(res.data.response[0]);
        }
      }
    })
    .catch((err) => console.log(err.message));
}
