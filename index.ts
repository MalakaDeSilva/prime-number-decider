import express from "express";
import cors from "cors";
import { initialize } from "./api/startup";
import { NODE_ID } from "./utils/Constants";

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

import bullyAlgoCtrl from "./controllers/bully";
import proposerCtrl from "./controllers/proposer";
import acceptorCtrl from "./controllers/acceptor";
import learnerCtrl from "./controllers/learner";

app.use("/api/election", bullyAlgoCtrl);
app.use("/api/proposer", proposerCtrl);
app.use("/api/acceptor", acceptorCtrl);
app.use("/api/learner", learnerCtrl);

app.use((req, res, next) => {
  res.status(404);
  res.json({
    error: {
      message: "Not found.",
    },
  });
});

const server = app.listen(process.env.PORT, () => {
  const { address, port } = server.address() as AddressInfo;
  initialize(app, address, port);

  console.log(
    `API id: ${app.get(NODE_ID)}, listening on: http://${address}:${port}`
  );
});
