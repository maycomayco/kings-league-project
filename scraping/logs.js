import pc from "picocolors";

const symbols = {
  info: pc.blue("ℹ"),
  success: pc.green("✔"),
  warning: pc.yellow("⚠"),
  error: pc.red("✖"),
};

export const logInfo = (...args) =>
  console.log(`${symbols.info} ${pc.cyan(...args)}`);
export const logError = (...args) =>
  console.log(`${symbols.error} ${pc.red(...args)}`);
export const logSuccess = (...args) =>
  console.log(`${symbols.success} ${pc.green(...args)}`);
export const logWarning = (...args) =>
  console.log(`${symbols.warning} ${pc.yellow(...args)}`);
