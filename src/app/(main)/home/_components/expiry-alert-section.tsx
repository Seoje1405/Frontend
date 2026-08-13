import { getExpiryAlerts } from '@/lib/data/home';
import ExpiryAlertCard from './expiry-alert-card';

interface ExpiryAlertSectionProps {
  patientId: number;
}

export async function ExpiryAlertSection({ patientId }: ExpiryAlertSectionProps) {
  const alerts = await getExpiryAlerts(patientId);

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {alerts.map((alert) => (
        <ExpiryAlertCard
          key={alert.id}
          medicationName={alert.medicationName}
          daysLeft={alert.daysLeft}
          totalDays={alert.totalDays}
        />
      ))}
    </div>
  );
}
