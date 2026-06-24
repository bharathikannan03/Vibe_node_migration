import express from "express";
import { errorHandler, notFoundHandler } from "../middleware/error-handler.js";
import policyRouter from "../route/policy-route.js";
import roleAccessRouter from "../route/role-access-route.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    data: {}
  });
});

app.use("/api/policies", policyRouter);
app.use("/api/edit", policyRouter);
app.use("/api", roleAccessRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vibe Node Migration API Running"
  });
});
export default app;
