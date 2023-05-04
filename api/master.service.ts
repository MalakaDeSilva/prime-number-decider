import { Service, ServiceType } from "../model/service";
import app from "../index";
import {
  ACCEPTOR,
  ASSIGN_ROLE,
  ASSIGN_TASK,
  CURRENT_JOB,
  GET_SERVICES_ROUTE,
  IN_PROGRESS,
  LEARNER,
  PROPOSER,
  PROPOSERS,
  SELF,
} from "../utils/Constants";
import { getServices } from "./startup.service";
import axios from "axios";
import { Job } from "../model/job";

export function assignRoles(callback: () => void) {
  getServices(process.env.SERVICE_REGISTRY + GET_SERVICES_ROUTE, (services) => {
    const self = app.get(SELF) as Service;
    const nodesExceptLearner = services.filter(
      (service) => service.id != self.id
    );

    let roleAssignedNodes = [];

    if (services.length > 4) {
      // There are more than 4 nodes in the network, enough to be divided into all 3 roles
      let learner = { ...(app.get(SELF) as Service), role: LEARNER };

      let acceptors = nodesExceptLearner.splice(0, 2).map((service) => {
        return { ...service, role: ACCEPTOR };
      });

      let proposers = nodesExceptLearner.map((service) => {
        return { ...service, role: PROPOSER };
      });

      app.set(PROPOSERS, proposers); // Store proposers in the master node since master is the learner node

      roleAssignedNodes.push(learner, ...acceptors, ...proposers);
    } else if (services.length == 3 || services.length == 4) {
      // There are only 3 or 4 nodes available in the network, some nodes will have to act two roles
    } else {
      // Not enough nodes
    }

    notifyNodes(roleAssignedNodes);
    callback();
  });
}

function notifyNodes(roleAssignedNodes: ServiceType[]) {
  let promises: any[] = [];

  roleAssignedNodes.forEach((node) => {
    promises.push(axios.get(node.uri + ASSIGN_ROLE + node.role));

    //if(node.role == )
  });

  Promise.all(promises)
    .then(
      axios.spread((...responses) => {
        if (responses.every((resp) => resp.status == 200)) {
          console.log("All nodes accepted the roles");
        } else {
          console.log("All nodes did not accept the roles");
        }
      })
    )
    .catch((error) => {
      console.log("Error:", error);
    });
}

export function delegateWork() {
  getProposers((proposers) => {
    let currentJob = app.get(CURRENT_JOB) as Job;

    let ranges = divideRange(2, currentJob.number, proposers.length);

    let promises: any[] = [];

    proposers.forEach((proposer, idx) => {
      promises.push(
        axios.post(proposer.uri + ASSIGN_TASK, {
          taskId: currentJob.id,
          number: currentJob.number,
          upperLimit: ranges[idx][1],
          lowerLimit: ranges[idx][0],
          status: IN_PROGRESS,
        })
      );
    });

    Promise.all(promises)
      .then(
        axios.spread((...responses) => {
          if (responses.every((response) => response.status == 200)) {
            console.log("All proposers accepted tasks.");
          } else {
            console.log("All proposers did not accept tasks.");
          }
        })
      )
      .catch((error) => {
        console.log("Error:", error.message);
      });
  });
}

function divideRange(lower: number, upper: number, numRanges: number) {
  const rangeSize = Math.floor((upper - lower) / numRanges);
  const ranges = [];

  let currentLower = lower;
  let currentUpper = lower + rangeSize;

  for (let i = 0; i < numRanges; i++) {
    if (i === numRanges - 1) {
      // For the last range, adjust the upper bound to ensure it covers the full range
      currentUpper = upper;
    }

    ranges.push([Math.floor(currentLower), Math.floor(currentUpper)]);

    currentLower = currentUpper;
    currentUpper += rangeSize;
  }

  return ranges;
}

function getProposers(callback: (proposers: ServiceType[]) => void) {
  callback(app.get(PROPOSERS));
}
