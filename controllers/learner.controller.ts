import { PENDING } from "../utils/Constants";
import { createJob } from "../api/job.service";
import express from "express";
import { jobs } from "../data/jobs";
import { assignRoles, delegateWork } from "../api/master.service";
import { handleVotes } from "../api/learner.service";
import { Vote } from "../model/vote";

const router = express.Router();

router.get("/get-tasks", (req, res) => {
  res.status(200).json({ response: jobs });
});

router.post("/notify-learner", (req, res) => {
  let { taskId, result, proposerId } = req.body;

  handleVotes(new Vote(taskId, proposerId, result), () => {
    if (jobs.some((job) => job.status == PENDING)) {
      assignRoles(() =>
        createJob(() => {
          setTimeout(() => {
            delegateWork();
          }, 1000);
        })
      );
    }
  });

  res
    .status(200)
    .json({ response: `Accepted the answer ${result} for task: ${taskId}` });
});

export default router;
