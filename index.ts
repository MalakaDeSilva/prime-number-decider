import express from "express";
import cors from "cors";
const process = require("process");
import { initialize } from "./api/startup.service";
import {
  IS_INTERRUPTED,
  IS_MASTER,
  MASTER,
  NODE_ID,
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

app.use("/api/election", bullyAlgoCtrl);
app.use("/api/proposer", proposerCtrl);
app.use("/api/acceptor", acceptorCtrl);
app.use("/api/learner", learnerCtrl);

app.get("/health-check", (req, res) => {
  res.status(200).json({ response: "OK" });
});

app.get("/info", (req, res) => {
  let info = {
    is_master: app.get(IS_MASTER),
    nodeId: app.get(NODE_ID),
    self: app.get(SELF),
    is_interrupted: app.get(IS_INTERRUPTED),
    services: app.get(SERVICES),
    master: app.get(MASTER),
  };

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

  console.log(
    `API id: ${app.get(NODE_ID)}, listening on: http://${address}:${port}`
  );
});

export default app;
