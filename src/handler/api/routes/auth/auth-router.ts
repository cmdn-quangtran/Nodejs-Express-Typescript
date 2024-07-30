import { Router } from "express";
import type { Container } from "inversify";
import { buildRegisterUserHandler } from "./register-handler";

export const buildAuthRouter = ({
  container,
}: {
  container: Container;
}): Router => {
  const authRouter = Router({ mergeParams: true });

  authRouter.post("/register", buildRegisterUserHandler({ container }));

  return authRouter;
};
