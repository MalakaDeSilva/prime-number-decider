import app from "../index";
import { startElection, stopElection } from "../api/election.service";
import express from "express";
import { Service } from "../model/service";
import { IS_MASTER, MASTER } from "../utils/Constants";

const router = express.Router();

router.get("/:id", (req, res) => {
  // TODO: implement bully algorithm
  let senderId = req.params.id;

  startElection(app, senderId);

  res.status(200).json({ message: "OK" });
});

router.post("/coordinator", (req, res) => {
  const service: Service = new Service(
    req.body.id,
    req.body.uri,
    req.body.role
  );

  stopElection();

  app.set(MASTER, service);
  app.set(IS_MASTER, false);

  res.status(200).json({ message: "ACK" });
});

export default router;
