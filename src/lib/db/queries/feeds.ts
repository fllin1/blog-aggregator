import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, User } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string
) {
  const result = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}

export async function deleteFeedFollow(user: User, feedId: string) {
  const result = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, user.id), eq(feedFollows.feedId, feedId)))
    .returning();
  return firstOrUndefined(result);
}

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({
      lastFetchAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchAt} desc nulls first`)
    .limit(1);
  return firstOrUndefined(result);
}
