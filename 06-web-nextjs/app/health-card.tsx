'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '@/lib/api';

export default function HealthCard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['health'], queryFn: fetchHealth });
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Could not reach the API.</p>;
  return <p>API: {data!.status} at {data!.time}</p>;
}
