import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase text-neon">Saved sessions</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Your History</h1>
        <p className="mt-4 text-base leading-7 text-white/58">
          Every recognition is saved in your browser with the sketch, date, matched group, and songs.
        </p>
      </section>
      <HistoryList />
    </main>
  );
}
