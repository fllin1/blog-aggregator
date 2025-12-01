import { db } from "..";
import { Feed, feedFollows, feeds, User, users } from "../schema";
import { readConfig } from "src/config";
import { getUser } from "./users";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string) {
  const config = readConfig();
  const user = await getUser(config.currentUserName);

  const [result] = await db
    .insert(feeds)
    .values({
      name: name,
      url: url,
      userId: user.id,
    })
    .returning();

  await createFeedFollow(url);
  printFeed(result, user);
  return result;
}

export async function getFeed(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export function printFeed(feed: Feed, user: User) {
  console.log(`The feed ${feed.name} from ${feed.url} (${feed.id})`);
  console.log(`Has been added by ${user.name} (${user.id})`);
}

export async function createFeedFollow(url: string) {
  const config = readConfig();
  const user = await getUser(config.currentUserName);

  const feed = await getFeed(url);

  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      userId: user.id,
      feedId: feed.id,
    })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      username: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  printFeed(feed, user);
  return result;
}

export async function getFeedFollowsForUser(username: string) {
  const [user] = await db.select().from(users).where(eq(users.name, username));
  const results = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, user.id));

  return results;
}
