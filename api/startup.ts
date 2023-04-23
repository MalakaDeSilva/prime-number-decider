import axios from "axios";
import express from "express";
import { ServiceType } from "../model/service";
import { extractUri, randomIntFromInterval } from "../utils/Utils";
import {
  GET_SERVICES,
  NODE_ID,
  REGISTER_SERVICE,
  SERVICES,
} from "../utils/Constants";

interface ServerResponse {
  response: ServiceType[];
}

export function initialize(
  app: express.Application,
  host: string,
  port: number
) {
  let nodeId = `${Date.now()}${randomIntFromInterval(10, 20)}`;

  app.set(NODE_ID, nodeId);
  registerService(
    process.env.SERVICE_REGISTRY + REGISTER_SERVICE,
    extractUri(host, port),
    nodeId
  );

  getServices(process.env.SERVICE_REGISTRY + GET_SERVICES, (services) => {
    console.log(services);

    app.set(SERVICES, services);
  });
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
    .then((value) => console.log(value.data))
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
