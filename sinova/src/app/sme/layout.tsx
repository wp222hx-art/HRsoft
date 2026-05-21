import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SmeShell } from '@/components/portal/SmeShell';

export default async function SmeLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/sme');
  if (user.portal === 'PRO') redirect('/pro');
  return (
    <SmeShell user={{
      id: user.id, name: user.name, email: user.email,
      novaTokens: user.novaTokens, streakDays: user.streakDays,
      aiPersona: user.aiPersona,
    }}>
      {children}
    </SmeShell>
  );
}
