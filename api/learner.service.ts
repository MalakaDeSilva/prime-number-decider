import app from "../index";
import { JobType } from "../model/job";
import { ServiceType } from "../model/service";
import { Vote } from "../model/vote";
import { CURRENT_JOB, DONE, PROPOSERS } from "../utils/Constants";
import { updateJob } from "./job.service";
import { addVote, getFinalVoteForTask, getVotesByTask } from "./votes.service";

export function handleVotes(vote: Vote, callback: () => void) {
  let currentJob = app.get(CURRENT_JOB) as JobType;
  let proposers = app.get(PROPOSERS) as ServiceType[];

  addVote(vote);

  let votesByTask = getVotesByTask(vote.taskId);

  if (votesByTask.length == proposers.length) {
    // All proposers gave votes
    let result = getFinalVoteForTask(vote.taskId);
    updateJob({ ...currentJob, status: DONE, result }, callback);
  }
}
