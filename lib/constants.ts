export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    date: "November 15, 2025",
    time: "09:00 AM - 06:00 PM",
    location: "Amsterdam, Netherlands",
  },
  {
    title: "AI Hackathon SF 2025",
    image: "/images/event2.png",
    slug: "ai-hackathon-sf-2025",
    date: "November 22, 2025",
    time: "10:00 AM - 10:00 PM",
    location: "San Francisco, CA",
  },
  {
    title: "Next.js Conf",
    image: "/images/event3.png",
    slug: "nextjs-conf-2025",
    date: "December 5, 2025",
    time: "08:00 AM - 05:00 PM",
    location: "Online",
  },
  {
    title: "Web3 Developer Meetup",
    image: "/images/event4.png",
    slug: "web3-developer-meetup",
    date: "November 30, 2025",
    time: "06:00 PM - 09:00 PM",
    location: "Austin, TX",
  },
  {
    title: "DevOps World 2025",
    image: "/images/event5.png",
    slug: "devops-world-2025",
    date: "December 10, 2025",
    time: "09:00 AM - 06:00 PM",
    location: "London, UK",
  },
  {
    title: "Frontend Design Systems Workshop",
    image: "/images/event6.png",
    slug: "frontend-design-systems-workshop",
    date: "December 18, 2025",
    time: "10:00 AM - 04:00 PM",
    location: "New York, NY",
  },
];

