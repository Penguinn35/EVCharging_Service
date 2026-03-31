import { useState, useEffect, useRef } from "react";

export function useSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<T | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestRequestRef = useRef(0); // prevent race condition

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchTerm.trim()) {
        setResults(null);
        return;
      }

      const requestId = ++latestRequestRef.current;

      setIsSearching(true);
      setError(null);

      searchFunction(searchTerm)
        .then((data) => {
          // ignore outdated response
          if (requestId === latestRequestRef.current) {
            setResults(data);
          }
        })
        .catch((err) => {
          if (requestId === latestRequestRef.current) {
            setError(err.message || "Search failed");
          }
        })
        .finally(() => {
          if (requestId === latestRequestRef.current) {
            setIsSearching(false);
          }
        });
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]); // ❗ removed searchFunction

  return {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
    error,
  };
}