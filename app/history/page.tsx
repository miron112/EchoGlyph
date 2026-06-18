import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase text-neon">Сохранённые сеансы</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">Ваша история</h1>
        <p className="mt-4 text-base leading-7 text-white/58">
          Каждый результат сохраняется в браузере вместе с рисунком, датой, найденной группой и песнями.
        </p>
      </section>
      <HistoryList />
    </main>
  );
}
