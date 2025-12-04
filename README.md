# Bold-Aligator

A CLI tool to aggregate RSS feeds and browse blog posts like it's 2005 (but with modern TypeScript, because we're not animals).

## What You'll Need

Before you can start hoarding blog posts, make sure you have:

- **Node.js** - The JavaScript runtime (because browsers are for peasants)
- **PostgreSQL** - A database to store all those feeds (yes, you need to set one up yourself)
- **npm** - To install dependencies (obviously)

## Getting Started

### 1. Install the Dependencies

```bash
npm install
```

This installs all the packages. If it fails, check your internet connection and/or your life choices.

### 2. Set Up Your Config File

Create a file called `.gatorconfig.json` in your home directory (`~/.gatorconfig.json`). It should look like this:

```json
{
  "db_url": "postgresql://username:password@localhost:5432/database_name",
  "current_user_name": ""
}
```

**Important notes:**

- Replace `username`, `password`, `localhost`, `5432`, and `database_name` with your actual PostgreSQL credentials
- Leave `current_user_name` empty for now - you'll set it when you register/login
- If you mess this up, the CLI will yell at you (politely, with error messages)

### 3. Set Up the Database

Run the migrations to create all the tables:

```bash
npm run migrate
```

If this fails, check that your PostgreSQL is running and your `db_url` is correct. The database won't create itself (we're not wizards).

## Running Commands

Run commands like this:

```bash
npm start <command> [args...]
```

Or if you're feeling fancy:

```bash
tsx ./src/index.ts <command> [args...]
```

## Available Commands

### User Management

**`register <name>`** - Create a new user account

```bash
npm start register alice
```

Creates a user and automatically logs you in. No password needed (we're living dangerously).

**`login <name>`** - Switch to an existing user

```bash
npm start login bob
```

Switches your session to another user. The config file remembers who you are.

**`users`** - List all registered users

```bash
npm start users
```

See who else is using this thing (spoiler: probably just you).

### Feed Management

**`addfeed <feed_name> <url>`** - Add a new RSS feed ⚠️ _Requires login_

```bash
npm start addfeed "Tech Blog" https://example.com/feed.xml
```

Creates a feed and automatically follows it. Convenient!

**`feeds`** - List all feeds in the system

```bash
npm start feeds
```

See what feeds exist (even ones you didn't create).

**`follow <feed_url>`** - Follow an existing feed ⚠️ _Requires login_

```bash
npm start follow https://example.com/feed.xml
```

Start following a feed that someone else added.

**`following`** - List feeds you're following ⚠️ _Requires login_

```bash
npm start following
```

See what feeds you're subscribed to.

**`unfollow <feed_url>`** - Unfollow a feed ⚠️ _Requires login_

```bash
npm start unfollow https://example.com/feed.xml
```

Break up with a feed. It's not you, it's them.

### Aggregation & Browsing

**`agg <time_between_reqs>`** - Start aggregating feeds periodically

```bash
npm start agg 1h 30m
```

Runs continuously, fetching feeds at the specified interval. Supports formats like:

- `1h 30m 15s` (human readable)
- `3500ms` (milliseconds, for robots)

Press Ctrl+C to stop. It will gracefully shut down (unlike some programs we know).

**`browse [limit]`** - Browse posts from feeds you follow ⚠️ _Requires login_

```bash
npm start browse 10
```

Shows posts from feeds you're following. Default limit is 2 if you don't specify (we're trying to save your screen space).

### Utility Commands

**`reset`** - Reset the database (nuclear option)

```bash
npm start reset
```

⚠️ **WARNING**: This deletes ALL data. Use with caution. We're not responsible for your tears.

## Quick Start Example

```bash
# 1. Set up your config file (~/.gatorconfig.json)
# 2. Run migrations
npm run migrate

# 3. Register a user
npm start register myname

# 4. Add a feed
npm start addfeed "Hacker News" https://hnrss.org/frontpage

# 5. Start aggregating (in one terminal)
npm start agg 5m

# 6. Browse posts (in another terminal)
npm start browse 5
```

## Pro Tips

- Commands marked with ⚠️ _Requires login_ need you to be logged in first (use `register` or `login`)
- The config file stores your current user session, so you don't need to log in every time
- Run `agg` in the background or a separate terminal - it runs forever until you stop it
- If something breaks, check your database connection and config file format

Happy feed aggregating! 🐊
