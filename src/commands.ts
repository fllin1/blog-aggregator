import { setUser, readConfig } from "./config";
import {
  createUser,
  deleteAllUsers,
  getUser,
  getUserById,
  getUsers,
} from "./lib/db/queries/users";
import {
  createFeed,
  createFeedFollow,
  getFeedFollowsForUser,
  getFeeds,
  printFeed,
} from "./lib/db/queries/feeds";
import { fetchFeed } from "./rss";
import { db } from "./lib/db";
import { feedFollows, feeds } from "./lib/db/schema";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
type CommandsRegistry = Record<string, CommandHandler>;

async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (!(cmdName in registry)) {
    throw new Error(`Command ${cmdName} is not a registerd command`);
  }
  await registry[cmdName](cmdName, ...args);
}

async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Expects a single argument, the username.");
  }

  const result = await getUser(args[0]);
  if (typeof result.name !== "string") {
    console.error(`Username "${args[0]}" doesn't exist`);
    process.exit(1);
  }

  setUser(args[0]);
  console.log(`Username set: ${args[0]}`);
}

async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Expects a single argument, the username.");
  }

  try {
    const result = await createUser(args[0]);
    console.log(`User "${result.name}" registered.`);
    setUser(result.name);
  } catch (err: any) {
    if (err.cause?.code === "23505") {
      console.error(`User "${args[0]}" already exists.`);
      process.exit(1);
    } else {
      throw err;
    }
  }
}

async function handlerReset(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    throw new Error("No arguments for reseting the User Table");
  }

  try {
    await deleteAllUsers();
    await db.delete(feedFollows);
    await db.delete(feeds);
    console.log("Successfully reset Table User");
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}

async function handlerUsers(cmdName: string, ...args: string[]) {
  if (args.length > 0) {
    throw new Error("No arguments for reseting the User Table");
  }

  try {
    const users = await getUsers();

    const config = readConfig();
    const currentUser = config.currentUserName;

    for (const user of users) {
      let message = `* ${user.name}`;
      if (user.name === currentUser) {
        message += " (current)";
      }
      console.log(message);
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}

async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Expects a no argument");
  }

  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed));
}

async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error("Expects 2 arguments, the name and url of the feed.");
  }

  const name = args[0];
  const url = args[1];
  await createFeed(name, url);
}

async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Doesn't expect any arguments");
  }

  const feeds = await getFeeds();
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    printFeed(feed, user);
  }
}

async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Expects 1 arguments, the url of the feed.");
  }

  const url = args[0];
  const result = await createFeedFollow(url);

  console.log(result.feedName);
  console.log(result.username);
}

async function handlerFollowing(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error("Doesn't expect any argument.");
  }

  const config = readConfig();
  const currentUser = config.currentUserName;

  const follows = await getFeedFollowsForUser(currentUser);

  console.log(currentUser + " follows:");
  for (const follow of follows) {
    console.log(follow.feedName);
  }
}

export {
  registerCommand,
  runCommand,
  handlerAddFeed,
  handlerAgg,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  CommandsRegistry,
};
