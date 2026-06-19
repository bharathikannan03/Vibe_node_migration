import express from "express";
import { errorHandler, notFoundHandler } from "../middleware/error-handler.js";
import policyRouter from "../route/policy-route.js";

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
