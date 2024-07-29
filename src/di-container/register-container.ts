import { Container } from "inversify";
import * as serviceId from "./service-id";
import { unwrapEnv } from "./env-util";

export const registerContainer = (): Container => {
  const container = new Container();

  /**
   * Environment Variables
   */
  container
    .bind(serviceId.ALLOW_ORIGINS)
    .toConstantValue(unwrapEnv("ALLOW_ORIGINS"));

  return container;
};
