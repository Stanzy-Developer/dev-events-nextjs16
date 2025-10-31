# Next.js 16 Event Management Platform

A full-stack event management app I built to explore Next.js 16's new features. It's a platform for discovering and booking developer events like hackathons, meetups, and conferences.

## What It Does

This is a modern event platform where you can browse upcoming dev events and register with just your email. The app features event recommendations based on similar topics, image optimization with Cloudinary, and user analytics tracking. I've also implemented Next.js 16's new features like the React Compiler and improved caching strategies to keep things fast.

## Tech Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19.2.0 with React Compiler
- Tailwind CSS v4
- Lucide React for icons
- OGL for some 3D visual effects

**Backend:**

- MongoDB with Mongoose
- Cloudinary for image storage
- PostHog for analytics

**Dev Tools:**

- TypeScript
- pnpm
- ESLint
- Turbopack for dev builds

## Project Structure

```
nextjs-16-tuto/
├── app/
│   ├── api/events/              # Event API endpoints (GET/POST)
│   ├── events/[slug]/           # Individual event pages
│   └── page.tsx                 # Homepage with event listings
│
├── components/
│   ├── BookEvent.tsx            # Booking form
│   ├── EventCard.tsx            # Event card component
│   ├── ExploreBtn.tsx           # Scroll button
│   ├── LightRays.tsx            # 3D visual effect
│   └── Navbar.tsx               # Navigation
│
├── database/
│   ├── event.model.ts           # Event schema
│   ├── booking.model.ts         # Booking schema
│   └── index.ts
│
├── lib/
│   ├── actions/
│   │   ├── booking.actions.ts   # Server actions for bookings
│   │   └── event.actions.ts     # Server actions for events
│   ├── mongodb.ts               # DB connection
│   └── utils.ts
│
└── public/                      # Static assets
```

## Getting Started

### What You Need

- Node.js 20+
- pnpm (or npm/yarn if you prefer)
- MongoDB (local or Atlas)
- Cloudinary account
- PostHog account (optional, for analytics)

### Setup

Clone and install:

```bash
git clone <repository-url>
cd nextjs-16-tuto
pnpm install
```

Create a `.env.local` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# PostHog (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Run the dev server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Models

### Event Model

The event model handles all the event data. The slug is auto-generated from the title, and dates/times are normalized on save.

```typescript
{
  title: string;           // Max 100 chars
  slug: string;            // Auto-generated, URL-friendly
  description: string;     // Max 1000 chars
  overview: string;        // Max 500 chars
  image: string;           // Cloudinary URL
  venue: string;
  location: string;
  date: string;            // YYYY-MM-DD format
  time: string;            // HH:MM (24-hour)
  mode: 'online' | 'offline' | 'hybrid';
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];          // Used for similar events
  createdAt: Date;
  updatedAt: Date;
}
```

### Booking Model

Bookings are pretty straightforward - just an event ID and email. There's a unique constraint so users can't double-book the same event.

```typescript
{
  eventId: ObjectId; // Links to Event
  email: string; // Validated and lowercase
  createdAt: Date;
  updatedAt: Date;
}
```

The model includes a pre-save hook that checks if the event actually exists before creating the booking, which prevents orphaned bookings.

## API Endpoints

### GET `/api/events`

Returns all events, newest first.

### POST `/api/events`

Creates a new event. Send as `multipart/form-data` with:

- All event fields (title, description, etc.)
- `tags` and `agenda` as JSON strings
- `image` as a file (max 5MB, JPEG/PNG/WebP/GIF only)

The image gets uploaded to Cloudinary before the event is created.

### GET `/api/events/[slug]`

Returns a single event by its slug.

## Server Actions

**`createBooking()`** - Creates a booking for an event. Located in `lib/actions/booking.actions.ts`

**`getSimilarEventsBySlug()`** - Finds events with matching tags. Located in `lib/actions/event.actions.ts`

## Key Components

### BookEvent

The booking form component. It's a client component that handles email submission and tracks the event with PostHog when someone registers.

```tsx
<BookEvent eventId={string} slug={string} />
```

### EventCard

Displays event info in a card. Used on the homepage to show all events.

## Performance Stuff

I'm using Next.js 16's new caching features with the `"use cache"` directive. For example, the homepage caches data for hours since events don't change that often:

```typescript
"use cache";
cacheLife("hours");
```

The React Compiler is also enabled, which automatically optimizes components without needing to manually add `useMemo` and `useCallback` everywhere.

Turbopack is enabled for dev builds - it's noticeably faster than Webpack for hot reloading.

## Development

```bash
pnpm dev     # Start dev server
pnpm build   # Build for production
pnpm start   # Start production server
pnpm lint    # Run ESLint
```

### Naming Conventions

- Components: PascalCase (`BookEvent.tsx`)
- Utilities: camelCase (`mongodb.ts`)
- Models: camelCase with `.model.ts` suffix

### Feature Flags & Custom Properties

If you're adding feature flags:

- Use TypeScript enums or const objects
- Name them UPPERCASE_WITH_UNDERSCORE
- Keep usage minimal to avoid scattered logic
- Always validate flag values

For custom properties (PostHog events, etc.):

- Use enums/const objects if used in multiple places
- Stay consistent with any existing naming patterns

## Deployment

I'd recommend Vercel since it's built by the Next.js team:

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

Make sure to update `NEXT_PUBLIC_BASE_URL` to your production URL.

## Security Notes

- Emails are validated with RFC 5322 compliant regex
- Image uploads are restricted to specific types and max 5MB
- Mongoose schemas validate everything before hitting the database
- API errors don't expose internal details

## Resources

If you want to learn more:

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [PostHog Docs](https://posthog.com/docs)

## Notes

This project took about 2h15min to build. It was a great way to test out Next.js 16's new features, especially the React Compiler and improved caching.

If you're using this as a reference or starting point for your own project, feel free to adapt it however you need. The event/booking system is pretty generic and could be adapted for other types of events beyond just developer conferences.

## Contributing

If you want to contribute, just fork it and send a PR. No formal process - just make sure the code is clean and follows the existing patterns.

---

Built with Next.js 16, styled with Tailwind CSS, and probably too much coffee.
