import fs from "fs";
import os from "os";
import path from "path";

// Paths
const configPath = path.join(os.homedir(), ".gatorconfig.json");

// Config
type Config = {
  dbUrl: string;
  currentUserName: string;
};

function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}

// Functions
export function setUser(currentUserName: string): void {
  const config = readConfig();
  config.currentUserName = currentUserName;
  writeConfig(config);
}

export function readConfig(): Config {
  const configRaw = fs.readFileSync(configPath, { encoding: "utf-8" });
  const rawConfig = JSON.parse(configRaw);
  return validateConfig(rawConfig);
}

function writeConfig(config: Config): void {
  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const jsonConfig = JSON.stringify(rawConfig);
  fs.writeFileSync(configPath, jsonConfig, { encoding: "utf-8" });
}
