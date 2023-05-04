import express from "express";
import app from "../index";
import { IN_PROGRESS, TASK } from "../utils/Constants";
import { Task } from "../model/task";
import { findPrimeOrNotPrime } from "../api/proposer.service";

const router = express.Router();

// TODO: implement endpoints
router.post("/assign-task", (req, res) => {
  let { taskId, number, upperLimit, lowerLimit, status } = req.body;
  let task = new Task(taskId, number, upperLimit, lowerLimit, status);

  if (status == IN_PROGRESS) {
    app.set(TASK, task);

    findPrimeOrNotPrime(task);

    res.status(200).json({ message: "Task is accepted." });
  } else {
    res.status(200).json({ message: "Task is not accepted." });
  }
});

export default router;
