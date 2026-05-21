import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ProShell } from '@/components/portal/ProShell';

export default async function ProLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/pro');
  if (user.portal !== 'PRO' && user.portal !== 'ADMIN') redirect('/sme');
  return (
    <ProShell user={{
      id: user.id, name: user.name, email: user.email,
      novaTokens: user.novaTokens, streakDays: user.streakDays,
    }}>
      {children}
    </ProShell>
  );
}
