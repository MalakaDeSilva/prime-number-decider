import express from "express";
import app from "../index";
import { SELF, UPDATE_SERVICE } from "../utils/Constants";
import { Service } from "../model/service";
import axios from "axios";

const router = express.Router();

router.get("/assign-role/:role", (req, res) => {
  let role = req.params.role;

  app.set(SELF, { ...(app.get(SELF) as Service), role });

  axios
    .put(process.env.SERVICE_REGISTRY + UPDATE_SERVICE, {
      ...(app.get(SELF) as Service),
      role,
    })
    .then((res) => console.log(res.data.response))
    .catch((err) => console.log(err.message));

  res.status(200).json({ message: "Role is accepted." });
});

export default router;
