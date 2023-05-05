import { NOT_PRIME, PRIME } from "../utils/Constants";
import { votes } from "../data/votes";
import { Vote } from "../model/vote";

export function addVote(vote: Vote) {
  let idx = votes.findIndex(
    (_vote) => _vote.nodeId == vote.nodeId && _vote.taskId == vote.taskId
  );

  if (idx == -1 || votes.length == 0) {
    votes.push(vote);
  } else {
    if (vote.result == NOT_PRIME) {
      votes[idx] = { ...votes[idx], result: vote.result };
    }
  }
}

export function getVotesByTask(taskId: string) {
  return votes.filter((vote) => vote.taskId == taskId);
}

export function getFinalVoteForTask(taskId: string) {
  let markedVotes = votes.filter((vote) => vote.taskId == taskId);

  return markedVotes.some((vote) => vote.result == NOT_PRIME)
    ? NOT_PRIME
    : PRIME;
}
