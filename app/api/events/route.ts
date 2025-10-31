import { v2 as cloudinary } from "cloudinary";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries())
    } catch {
      return NextResponse.json({message: "Invalid Json data format"}, {status: 400})
    }

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

     // Parse tags and agenda early to catch JSON errors
     let tags, agenda;
     try {
       tags = JSON.parse(formData.get("tags") as string);
       agenda = JSON.parse(formData.get("agenda") as string);
     } catch {
       return NextResponse.json(
         { message: "Invalid tags or agenda format" }, 
         { status: 400 }
       );
     }
    
    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" }, 
        { status: 400 }
      );
    }
    
    // Validate content type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" }, 
        { status: 400 }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image', folder: "DevEvent" }, (error, results) => {
        if (error) return reject(error);
        resolve(results)
      }).end(buffer)
    })

    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    // Validate required fields from event object
    if (!event.title  || !event.description) {
      return NextResponse.json(
        { message: "Missing required event fields" }, 
        { status: 400 }
      );
    }
    
    const createdEvent = await Event.create({
      ...event,
      image: imageUrl,
      tags: tags,
      agenda: agenda
    })

    return NextResponse.json({message: 'Event Created Successfully', event: createdEvent}, {status: 201})
  } catch {
    return NextResponse.json(
      { message: "Event creation failed" }, 
      { status: 500 }
    );
  }

}

export const GET = async () => {
  try {
    await connectDB();
 
    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Failed to fetch events" }, 
      { status: 500 }
    );
  }
}



