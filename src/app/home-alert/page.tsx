import ExpiryAlertCard from './components/expiry-alert-card';

const SAMPLE_ALERTS = [
  { id: 1, medicationName: '아모디핀정 5mg', daysLeft: 3, totalDays: 10 },
  { id: 2, medicationName: '타이레놀 500mg', daysLeft: 7, totalDays: 30 },
];

export default function HomeAlertPage() {
  return (
    <main className="flex flex-col gap-3 px-4 py-4">
      {SAMPLE_ALERTS.map((alert) => (
        <ExpiryAlertCard
          key={alert.id}
          medicationName={alert.medicationName}
          daysLeft={alert.daysLeft}
          totalDays={alert.totalDays}
        />
      ))}
    </main>
  );
}
