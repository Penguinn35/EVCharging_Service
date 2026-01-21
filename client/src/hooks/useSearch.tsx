import { useState, useEffect } from "react";

export function useSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState<string>(""); // The current search term
  const [results, setResults] = useState<T | null>(null); // The search results
  const [isSearching, setIsSearching] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setIsSearching(true);
        searchFunction(searchTerm)
          .then((data) => {
            setResults(data);
          })
          .finally(() => {
            setIsSearching(false);
          });
      } else {
        setResults(null); // Clear results if the search term is empty
      }
    }, delay);

    return () => {
      clearTimeout(handler); // Clear the timeout on cleanup
    };
  }, [searchTerm, searchFunction, delay]);

  return { searchTerm, setSearchTerm, results, isSearching };
}