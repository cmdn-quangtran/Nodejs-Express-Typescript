import type * as inversify from "inversify";
import type { Request, Response } from "express";

export const buildHealthCheckHandler =
  (_: { container: inversify.Container }) =>
  async (_req: Request<undefined>, res: Response) => {
    res.status(200).send("hello");
  };
