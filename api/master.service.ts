import { Service } from "../model/service";
import app from "../index";
import {
  ACCEPTOR,
  GET_SERVICES_ROUTE,
  LEARNER,
  PROPOSER,
  SELF,
} from "../utils/Constants";
import { getServices } from "./startup.service";

export function assignRoles() {
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

      let proposers = nodesExceptLearner.splice(2).map((service) => {
        return { ...service, role: PROPOSER };
      });

      roleAssignedNodes.push(learner, ...acceptors, ...proposers);
    } else if (services.length == 3 || services.length == 4) {
      // There are only 3 or 4 nodes available in the network, some nodes will have to act two roles
    } else {
      // Not enough nodes
    }

    console.log(roleAssignedNodes);
  });
}
