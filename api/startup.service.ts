import axios from "axios";
import { ServiceType } from "../model/service";
import { extractUri, randomIntFromInterval } from "../utils/Utils";
import {
  GET_SERVICES_ROUTE,
  IS_INTERRUPTED,
  IS_MASTER,
  MASTER,
  NODE_ID,
  REGISTER_SERVICE_ROUTE,
  SELF,
  SERVICES,
} from "../utils/Constants";
import { Service } from "../model/service";
import app from "../index";

interface ServerResponse {
  response: ServiceType[];
}

export function initialize(host: string, port: number) {
  let nodeId = `${Date.now()}${randomIntFromInterval(10, 20)}`;

  app.set(IS_MASTER, false); // Mark current node as not the master node.

  app.set(NODE_ID, nodeId);
  app.set(SELF, new Service(nodeId, extractUri(host, port), ""));

  app.set(IS_INTERRUPTED, false); // Set IsInterrupted as false since there are no interruptions initially

  registerService(
    process.env.SERVICE_REGISTRY + REGISTER_SERVICE_ROUTE,
    extractUri(host, port),
    nodeId
  );

  getServices(process.env.SERVICE_REGISTRY + GET_SERVICES_ROUTE, (services) => {
    app.set(SERVICES, services);
  });

  if (app.get(MASTER) != null || typeof app.get(MASTER) == "undefined") {
    // TODO: start election
  }
}

export function registerService(
  serviceRegistryUri: string,
  uri: string,
  nodeId: string
) {
  axios
    .post(serviceRegistryUri, {
      id: nodeId,
      uri: uri,
      role: "",
    })
    .then((value) => console.log(value.data.response))
    .catch((error) => console.log(error));
}

export function getServices(
  serviceRegistryUri: string,
  callback: (services: ServiceType[]) => void
) {
  axios
    .get<ServerResponse>(serviceRegistryUri)
    .then((res) => {
      callback(res.data.response);
    })
    .catch((e) => console.log(e));
}
