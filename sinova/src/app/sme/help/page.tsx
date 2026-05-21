// SME portal — Help / User Guide page
import { getCurrentUser } from '@/lib/auth';
import { HelpView } from '@/components/help/HelpView';

export default async function SmeHelpPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <HelpView portal="sme" />;
}
