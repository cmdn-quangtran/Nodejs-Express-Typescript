import { Router } from "express";
import type { Container } from "inversify";
import { buildFindUserHandler } from "./find-user-handler";

export const buildUserRouter = ({
  container,
}: {
  container: Container;
}): Router => {
  const userRouter = Router({ mergeParams: true });

  userRouter.get("/", buildFindUserHandler({ container }));

  return userRouter;
};
