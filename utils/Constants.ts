export const NODE_ID = "nodeId";
export const SERVICES = "services";
export const MASTER = "master";
export const IS_MASTER = "is_master";
export const SELF = "self";
export const IS_ELECTION_STOPPED = "is_election_stopped";
export const LEARNER = "LEARNER";
export const ACCEPTOR = "ACCEPTOR";
export const PROPOSER = "PROPOSER";
export const PROPOSERS = "PROPOSERS";

export const PENDING = "PENDING";
export const IN_PROGRESS = "IN_PROGRESS";
export const DONE = "DONE";

export const TASK = "task";
export const TASK_ID = "task_id";
export const NUMBER = "number";
export const UPPER_LIMIT = "upper_limit";
export const LOWER_LIMIT = "lower_limit";
export const TASK_STATUS = "task_status";
export const PRIME = "prime";
export const NOT_PRIME = "not_prime";
export const CURRENT_JOB = "current_job";

export const REGISTER_SERVICE_ROUTE = "/register-service";
export const GET_SERVICES_ROUTE = "/get-services";
export const HEALTH_CHECK_ROUTE = "/health-check";
export const MARK_AS_MASTER = "/mark-node-as-master";
export const GET_ACCEPTORS = "/get-acceptors";
export const GET_LEARNERS = "/get-learners";
export const UPDATE_SERVICE = "/update-service";

export const ELECTION_ROUTE = "/api/election/";
export const COORDINATOR_ROUTE = "/api/election/coordinator";

export const ASSIGN_ROLE = "/api/roles/assign-role/";

export const ASSIGN_TASK = "/api/proposer/assign-task";

export const SEND_RESULT = "/api/acceptor/send-result";

export const NOTIFY_LEARNER = "/api/learner/notify-learner";
