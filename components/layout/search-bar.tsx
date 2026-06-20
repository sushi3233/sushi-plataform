'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar vídeos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-4"
      />
    </form>
  );
}
