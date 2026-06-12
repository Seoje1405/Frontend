import { WeekStrip } from './components/week-strip';

export default function CalendarPage() {
  const todayISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(new Date());

  return (
    <div className="flex h-full w-full flex-col">
      <WeekStrip anchorISO={todayISO} />
    </div>
  );
}
