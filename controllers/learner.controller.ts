import { CURRENT_JOB, DONE, NOT_PRIME, PENDING } from "../utils/Constants";
import { createJob, getJob, updateJob } from "../api/job.service";
import express from "express";
import { JobType } from "../model/job";
import app from "../index";
import { jobs } from "../data/tasks";
import { assignRoles, delegateWork } from "../api/master.service";

const router = express.Router();

router.get("/get-tasks", (req, res) => {
  res.status(200).json({ response: jobs });
});

router.post("/notify-learner", (req, res) => {
  let { result, proposerId } = req.body;

  let currentJob = app.get(CURRENT_JOB) as JobType;

  if (result == NOT_PRIME) {
    updateJob({ ...currentJob, status: DONE, result });
  } else {
    updateJob({ ...currentJob, status: DONE });
  }

  if (jobs.some((job) => job.status == PENDING)) {
    //console.log("##############################################################################################");

    assignRoles(() =>
      createJob(() => {
        setTimeout(() => {
          delegateWork();
        }, 40000);
      })
    );
  }

  res.status(200).json({ response: "Accepted the answer." });
});

export default router;
