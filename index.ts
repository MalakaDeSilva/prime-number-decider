import express from "express";
import cors from "cors";
const process = require("process");
import { initialize } from "./api/startup.service";
import {
  IS_ELECTION_STOPPED,
  IS_MASTER,
  MASTER,
  NODE_ID,
  PROPOSERS,
  SELF,
  SERVICES,
} from "./utils/Constants";

import dotenv from "dotenv";
import { AddressInfo } from "net";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

import bullyAlgoCtrl from "./controllers/election.controller";
import proposerCtrl from "./controllers/proposer.controller";
import acceptorCtrl from "./controllers/acceptor.controller";
import learnerCtrl from "./controllers/learner.controller";
import roleCtrl from "./controllers/roles.controller";
import { startElection } from "./api/election.service";

app.use("/api/election", bullyAlgoCtrl);
app.use("/api/proposer", proposerCtrl);
app.use("/api/acceptor", acceptorCtrl);
app.use("/api/learner", learnerCtrl);
app.use("/api/roles", roleCtrl);

app.get("/health-check", (req, res) => {
  res.status(200).json({ message: app.get(NODE_ID) });
});

app.get("/info", (req, res) => {
  let info = {
    is_master: app.get(IS_MASTER),
    nodeId: app.get(NODE_ID),
    self: app.get(SELF),
    is_election_stopped: app.get(IS_ELECTION_STOPPED),
    services: app.get(SERVICES),
    master: app.get(MASTER),
    poposers: (app.get(IS_MASTER) as boolean) ? app.get(PROPOSERS) : undefined,
  };

  console.log(app);

  res.status(200).json({ message: info });
});

app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: {
      message: "Not found.",
    },
  });
});

const server = app.listen(process.argv[2] || process.env.PORT, () => {
  const { address, port } = server.address() as AddressInfo;
  initialize(address, port);

  setTimeout(() => {
    if (!app.get(IS_ELECTION_STOPPED) as boolean) {
      console.log(`Node ${app.get(NODE_ID)} is starting own election.`);
      startElection(app, app.get(NODE_ID));
    }
  }, process.argv[2]);

  console.log(
    `Node id: ${app.get(NODE_ID)}, listening on: http://${address}:${port}`
  );
});

export default app;
