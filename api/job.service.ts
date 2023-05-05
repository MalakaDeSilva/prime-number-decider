import { CURRENT_JOB, IN_PROGRESS, PENDING, PRIME } from "../utils/Constants";
import { jobs } from "../data/jobs";
import { Job, JobType } from "../model/job";
import fs from "fs";
import app from "../index";
import { randomIntFromInterval } from "../utils/Utils";

export function addJobs(callback: () => void) {
  // Open a read stream to the file
  const stream = fs.createReadStream("./numbers.txt", { encoding: "utf8" });

  stream.on("data", (data) => {
    // Split the chunk into lines
    const lines = (data as string).split(/\r?\n/);

    lines.forEach((line) => {
      let job = new Job(
        `${Date.now()}${randomIntFromInterval(10, 20)}`,
        parseInt(line),
        [],
        PENDING,
        PRIME
      );

      jobs.push(job);
    });

    callback();
  });

  stream.on("end", () => {
    console.log("Finished adding jobs.");
  });

  stream.on("error", (err) => {
    console.error(err.message);
  });
}

export function updateJob(job: JobType, callback: () => void) {
  const idx = jobs.findIndex((_job) => _job.id == job.id);

  if (idx != -1) {
    jobs[idx] = { ...jobs[idx], status: job.status, result: job.result };
  }
  callback();
}

export function createJob(callback: () => void) {
  let job = jobs.find((job) => job.status == PENDING);

  if (typeof job != "undefined") {
    app.set(CURRENT_JOB, {
      ...job,
      status: IN_PROGRESS,
    });
    callback();
  } else {
    console.log("All jobs are completed.");
  }
}

export function getJob(jobId: string) {
  return jobs.find((job) => job.id == jobId);
}
