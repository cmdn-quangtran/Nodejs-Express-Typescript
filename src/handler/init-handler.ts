import { Container } from "inversify";
import { registerContainer } from "../di-container/register-container";

export const initHandler = (): {
  container: Container;
} => {
  try {
    const container = registerContainer();
    return { container };
  } catch (error) {
    console.error("Failed to register container", error);
    process.exit(1);
  }
};
