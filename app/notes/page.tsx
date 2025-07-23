import HoverExpand from "@/components/ui/hover-expand";

const semesters = [
  {
    id: 1,
    name: "Winter 2024",
    subtitle: "1st semester",
    image:
      "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
  },
  {
    id: 2,
    name: "Summer 2025",
    subtitle: "2nd semester",
    image:
      "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    name: "Monsoon 2025",
    subtitle: "3rd semester",
    image:
      "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Autumn 2025",
    subtitle: "4th semester",
    image:
      "https://assets.lummi.ai/assets/QmQLSBeCFHUwCv7WBpGr7T3P67UXaAw8B2vvmtKimyinrL?auto=format&w=1500",
  },
  {
    id: 5,
    name: "Winter 2025",
    subtitle: "5th semester",
    image:
      "https://assets.lummi.ai/assets/QmXe6v7jBF5L2R7FCio8KQdXwTX2uqzRycUJapyjoXaTqd?auto=format&w=1500",
  },
  {
    id: 6,
    name: "Spring 2026",
    subtitle: "6th semester",
    image:
      "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
  },
  {
    id: 7,
    name: "Summer 2026",
    subtitle: "7th semester",
    image:
      "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
  },
  {
    id: 8,
    name: "Autumn 2026",
    subtitle: "8th semester",
    image:
      "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
  },
];

export default function NotesDashboard() {
  return (
    <section className="mx-auto min-w-screen h-screen rounded-[24px] p-2 md:rounded-t-[44px]">
      <article className="relative z-50 mt-20 flex flex-col items-center justify-center">
        <h1 className="max-w-2xl text-center text-6xl font-semibold font-serif tracking-tight">
          Semesters
        </h1>
      </article>
      <HoverExpand semesters={semesters} />
    </section>
  );
}
