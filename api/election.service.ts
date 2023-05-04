import axios from "axios";
import express from "express";
import { Service } from "../model/service";
import {
  COORDINATOR_ROUTE,
  ELECTION_ROUTE,
  GET_SERVICES_ROUTE,
  HEALTH_CHECK_ROUTE,
  IS_ELECTION_STOPPED,
  IS_MASTER,
  MARK_AS_MASTER,
  MASTER,
  NODE_ID,
  SELF,
  SERVICES,
} from "../utils/Constants";
import app from "../index";
import { getServices } from "./startup.service";
import { assignRoles, delegateWork } from "./master.service";
import { addJobs, createJob } from "./job.service";

interface ServerResponse {
  response: string;
}

export function startElection(app: express.Application, nodeId: string) {
  //console.log("Election is started by Node: " + nodeId);

  getServices(process.env.SERVICE_REGISTRY + GET_SERVICES_ROUTE, (services) => {
    app.set(SERVICES, services);

    app.set(MASTER, null); // Set master node reference to null
    app.set(IS_MASTER, false); // Set self as not the master node

    const cancelTokenSource = axios.CancelToken.source();

    let promises: any[] = [];

    if (!(app.get(IS_ELECTION_STOPPED) as boolean)) {
      services.forEach((service) => {
        if (parseInt(app.get(NODE_ID)) < parseInt(service.id)) {
          promises.push(
            axios.get(service.uri + ELECTION_ROUTE + app.get(NODE_ID), {
              timeout: 5000,
              cancelToken: cancelTokenSource.token,
            })
          );
        }
      });

      if (promises.length > 0) {
        /* if (!(app.get(IS_ELECTION_STOPPED) as boolean)) {
          cancelTokenSource.cancel("Election Stopped"); // Stop resolving promises
        } */

        Promise.all(promises)
          .then(
            axios.spread((...responses) => {
              let nodesAlive = false; // Assume all nodes are dead

              responses.forEach((resp) => {
                if (resp.data.message == "OK") {
                  nodesAlive = true; // If at least one node is alive, change to "true"
                  finishElection(() => {}); // If at least one node is alive, stop the own election
                }
              });

              if (!nodesAlive) {
                finishElection(() => {
                  // No node has a higher id than Self
                  // Self is the master
                  app.set(IS_MASTER, true); // Set self as the master
                  app.set(MASTER, app.get(SELF) as Service); // Set master as the self
                  sendCoordinatorMessage(app.get(SELF) as Service);
                  addJobs(() =>
                    assignRoles(() => createJob(() => delegateWork()))
                  );
                });
              }
            })
          )
          .catch((error) => {
            if (axios.isCancel(error)) {
              console.log("Promise canceled:", error.message);
            } else {
              console.log("Error:", error.message);
            }
          });
      } else {
        finishElection(() => {
          // No node has a higher id than Self
          // Self is the master
          app.set(IS_MASTER, true); // Set self as the master
          app.set(MASTER, app.get(SELF) as Service); // Set master as the self
          sendCoordinatorMessage(app.get(SELF) as Service);
          addJobs(() => assignRoles(() => createJob(() => delegateWork())));
        });
      }
    }
  });
}

export function sendCoordinatorMessage(node: Service) {
  console.log("Master found: " + node.id);
  getServices(process.env.SERVICE_REGISTRY + GET_SERVICES_ROUTE, (services) => {
    let promises: any[] = [];

    services.forEach((v, i) => {
      if (v.id != node.id) {
        promises.push(axios.post(v.uri + COORDINATOR_ROUTE, node));
      }
    });

    // Use Promise.all to wait for all requests to finish
    Promise.all(promises)
      .then((responses) => {
        // Check if all responses have the expected JSON object
        const allSuccessful = responses.every((response) => {
          return response.data.message === "ACK";
        });

        if (allSuccessful) {
          console.log("All nodes acknowledged the master");
        } else {
          console.log("All nodes did not acknowledge the master");
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Promise canceled:", error.message);
        } else {
          console.log("Error:", error.message);
        }
      });
  });
}

export function finishElection(callback: () => void) {
  app.set(IS_ELECTION_STOPPED, true);
  callback();
}

export function updateRegistryWithNewMaster(node: Service) {
  axios
    .put(process.env.SERVICE_REGISTRY + MARK_AS_MASTER, node)
    .then((value) => console.log(value.data.response))
    .catch((error) => console.log(error));
}

export function healthCheckMaster(isMaster: boolean, masterNode: Service) {
  if (!isMaster) {
    axios
      .get<ServerResponse>(masterNode.uri + HEALTH_CHECK_ROUTE, {
        timeout: 5000,
      })
      .then((res) => {
        if (res.data?.response == "OK") {
          // Master is up and running
        } else {
          // Master is down
          startElection(app, masterNode.id);
        }
      })
      .catch((e) => console.log(e));
  }
}
