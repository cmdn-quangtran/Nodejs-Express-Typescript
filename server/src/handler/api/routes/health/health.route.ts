import { Router } from "express";
import type { Container } from "inversify";
import { buildHealthCheckHandler } from "./health-check-handler";

export const buildHealthRouter = ({ container }: { container: Container }) => {
  const healthRouter = Router({ mergeParams: true });

  healthRouter.get("/", buildHealthCheckHandler({ container }));

  return healthRouter;
};
