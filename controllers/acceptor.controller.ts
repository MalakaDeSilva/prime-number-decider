import express from "express";
import { ProposerResult } from "../model/proposer_result";
import { NOT_PRIME, PRIME } from "../utils/Constants";
import { notifyLearner, verifyResult } from "../api/acceptor.service";

const router = express.Router();

// TODO: implement endpoints
router.post("/send-result", (req, res) => {
  let { result, message, divisor, nodeId, number, jobId } = req.body;

  let propResult = new ProposerResult(
    jobId,
    number,
    result,
    message,
    divisor,
    nodeId
  );

  if (result == PRIME) {
    notifyLearner(propResult);
  } else if (result == NOT_PRIME) {
    verifyResult(number, divisor, result, () => {
      notifyLearner(propResult);
    });
  } else {
    //
  }

  res.status(200).json({ response: "Result is accepted" });
});

export default router;
