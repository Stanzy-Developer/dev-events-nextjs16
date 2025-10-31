import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

export default async function Home() {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`);

  if (!response.ok) {
    if (response.status === 404) {
      return notFound();
    }
    throw new Error(`Failed to fetch event: ${response.status}`);
  }

  const { events } = await response.json();
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br />
        Event You can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events.map((event: IEvent) => (
            <li key={event.title} className="">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
