export interface Health { status: string; time: string }
export async function fetchHealth(): Promise<Health> {
  const r = await fetch('/api/health');
  if (!r.ok) throw new Error('health failed');
  return r.json();
}
