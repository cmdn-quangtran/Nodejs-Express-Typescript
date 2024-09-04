import { Router } from "express";
import type { Container } from "inversify";
import { buildFindUserHandler } from "./find-user-handler";
import { buildUploadFileHandler } from "./upload-file-handler";

export const buildUserRouter = ({
  container,
}: {
  container: Container;
}): Router => {
  const userRouter = Router({ mergeParams: true });

  userRouter.get("/", buildFindUserHandler({ container }));

  userRouter.post("/upload", buildUploadFileHandler({ container }));

  return userRouter;
};
