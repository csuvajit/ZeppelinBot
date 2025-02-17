// tslint:disable:no-console
import { connect } from "./data/db";
import { Configs } from "./data/Configs";
import path from "path";
import * as _fs from "fs";

const fs = _fs.promises;

const authorId = "444432489818357760";
if (!authorId) {
  console.error("No author id specified");
  process.exit(1);
}

console.log("Connecting to database");
connect().then(async () => {
  const configs = new Configs();

  console.log("Loading config files");
  const configDir = path.join(__dirname, "..", "config");
  const configFiles = await fs.readdir(configDir);

  console.log("Looping through config files");
  for (const configFile of configFiles) {
    const parts = configFile.split(".");
    const ext = parts[parts.length - 1];
    if (ext !== "yml") continue;

    const id = parts.slice(0, -1).pop();
    const key = id === "global" ? "global" : `guild-${id}`;
    if (await configs.hasConfig(key)) continue;

    const content = await fs.readFile(path.join(configDir, configFile), { encoding: "utf8" });

    console.log(`Migrating config for ${key}`);
    await configs.saveNewRevision(key, content, authorId);
  }

  console.log("Done!");
  process.exit(0);
});
