import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Event slug is required'],
      immutable: true,
      lowercase: true,
     trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      lowercase: true,
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Event audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook: Generate slug, normalize date and time
EventSchema.pre('save', async function (next) {
  const event = this as IEvent;

  // Generate slug only if title is new or modified
  if (event.isNew) {
    event.slug = generateSlug(event.title);
  }

  // Normalize and validate date to ISO format if modified
  if (event.isModified('date')) {
    event.date = normalizeDateToISO(event.date);
  }

  // Normalize time format if modified (e.g., "14:30" or "2:30 PM")
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }

  next();
});

/**
 * Generates a URL-friendly slug from a title string
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalizes date string to ISO format (YYYY-MM-DD)
 * Accepts various date formats and converts to standard ISO
 */
function normalizeDateToISO(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  // Return ISO date string (YYYY-MM-DD)
  return date.toISOString().split('T')[0];
}

/**
 * Normalizes time to 24-hour format (HH:MM)
 * Accepts formats like "14:30", "2:30 PM", "02:30"
 */
function normalizeTime(timeStr: string): string {
  const trimmedTime = timeStr.trim();

  // Check if already in 24-hour format (HH:MM)
  if (/^\d{1,2}:\d{2}$/.test(trimmedTime)) {
    const [hours, minutes] = trimmedTime.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);

    if (h < 0 || h > 23 || m < 0 || m > 59) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  // Handle 12-hour format with AM/PM
  const ampmMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  throw new Error(`Invalid time format: ${timeStr}. Expected HH:MM or HH:MM AM/PM`);
}

// Create unique index on slug for faster queries and uniqueness enforcement
EventSchema.index({ slug: 1 }, { unique: true });

// Export the model, reusing existing model in development to prevent OverwriteModelError
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;

