import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  try {
    const response = await fetch(feedURL);

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }

    const xml = await response.text();

    const parser = new XMLParser();
    const parsed = parser.parse(xml);

    verifyRSSFeed(parsed);
    const channel = parsed.rss.channel;

    if (!Array.isArray(channel.item)) {
      channel.item = channel.item ? [channel.item] : [];
    }
    const items: RSSItem[] = [];
    for (const item of channel.item) {
      if (!verifyRSSItem(item)) {
        continue;
      }
      items.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      });
    }

    const feed: RSSFeed = {
      channel: {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        item: items,
      },
    };

    return feed;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching RSS feed: ${err.message}`);
      process.exit(1);
    }
    console.error("No one knows how we got there.");
    throw err;
  }
}

function verifyRSSFeed(parsed: any) {
  const channel = parsed.rss.channel;
  if (!channel || typeof channel !== "object") {
    throw new Error("Invalid RSS feed: missing 'channel' element");
  }

  // Validate required channel fields
  if (!channel.title || typeof channel.title !== "string") {
    throw new Error("Invalid RSS feed: missing or invalid 'title'");
  }
  if (!channel.link || typeof channel.link !== "string") {
    throw new Error("Invalid RSS feed: missing or invalid 'link'");
  }
  if (!channel.description || typeof channel.description !== "string") {
    throw new Error("Invalid RSS feed: missing or invalid 'description'");
  }
}

function verifyRSSItem(item: any) {
  if (!item.title || typeof item.title !== "string") {
    return false;
  }
  if (!item.link || typeof item.link !== "string") {
    return false;
  }
  if (!item.description || typeof item.description !== "string") {
    return false;
  }
  if (!item.pubDate || typeof item.pubDate !== "string") {
    return false;
  }
  return true;
}
