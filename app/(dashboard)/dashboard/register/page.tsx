import { DashboardHeader } from '@/components/dashboard';
import RegistrationForm from '@/components/forms/RegistrationForm/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="dashboard-content space-y-6">
      <DashboardHeader title="Register Athlete" subtitle="Structured registration form with improved UX" />
      <div className="max-w-3xl mx-auto">
        <RegistrationForm registrationType="athletes" />
      </div>
    </div>
  );
}
