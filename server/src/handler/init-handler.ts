import { Container } from "inversify";
import { registerContainer } from "../di-container/register-container";

export const initHandler = (): {
  container: Container;
  // eslint-disable-next-line consistent-return
} => {
  try {
    const container = registerContainer();
    return { container };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to register container", error);
    process.exit(1);
  }
};
