import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: {params: Promise<{ slug: string }>}) {
   try {
     await connectDB();

     const { slug } = await params;

     // Validate slug parameter
     if (!slug || typeof slug !== 'string' || slug.trim() === "") {
       return NextResponse.json({message: "Invalid or missing slug parameter"}, {status: 400})
     }

     // Sanitize slug (remove any potential malicious input )
     const sanitizedSlug = slug.trim().toLowerCase();

     // Query event by slug
     const event = await Event.findOne({ slug: sanitizedSlug }).lean();

     if (!event) {
       return NextResponse.json(
         { message: `Event with slug '${sanitizedSlug}' not found` },
         {status: 404}
       )
     }

     return NextResponse.json({message: "Event fetched successfully", event}, {status: 200})

   } catch (error) {
    console.error("Error fetching event by slug:", error);
    return NextResponse.json(
      { message: "Failed to fetch event" }, 
      { status: 500 }
    );
   }
 }
