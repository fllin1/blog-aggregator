import {
  CommandsRegistry,
  handlerAddFeed,
  handlerAgg,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  registerCommand,
  runCommand,
} from "./commands.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "follow", handlerFollow);
  registerCommand(registry, "following", handlerFollowing);

  if (process.argv.length < 3) {
    console.error("Requires at least one argument");
    process.exit(1);
  }

  const cmdName = process.argv[2];
  const args = process.argv.slice(3);

  try {
    await runCommand(registry, cmdName, ...args);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      process.exit(1);
    }
  }
  process.exit(0);
}

main();
