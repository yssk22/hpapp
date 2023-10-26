import { TierGate } from '@hpapp/features/auth';

export default function ({ children }: { children: React.ReactNode }) {
  return <TierGate allow="developer">{children}</TierGate>;
}
