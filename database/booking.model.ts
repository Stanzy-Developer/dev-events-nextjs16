import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook: Verify that the referenced event exists
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isNew || booking.isModified('eventId')) {
    try {
      // Import Event model dynamically to avoid circular dependency issues
      const Event = mongoose.models.Event || (await import('./event.model')).default;

      // Check if the event exists in the database
      const eventExists = await Event.exists({ _id: booking.eventId });

      if (!eventExists) {
        throw new Error(`Event with ID ${booking.eventId} does not exist`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
      return next(new Error('Failed to validate event reference'));
    }
  }

  next();
});

// Create index on eventId for faster lookup of bookings by event
BookingSchema.index({ eventId: 1 });

// Compound index for faster queries filtering by both eventId and email
BookingSchema.index({ eventId: 1, email: 1 });

// Export the model, reusing existing model in development to prevent OverwriteModelError
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

