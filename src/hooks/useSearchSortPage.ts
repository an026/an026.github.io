"use client";

import { useEffect, useMemo, useState } from "react";
import type { SortDir } from "@/lib/types";

export function useSearchSortPage<T>(
  items: T[],
  opts: {
    searchText: (item: T) => string;
    sortCompare: (a: T, b: T, dir: SortDir) => number;
    pageSize: number;
    dotThreshold?: number;
    resetKey?: unknown;
  }
) {
  const { searchText, sortCompare, pageSize, dotThreshold = 10, resetKey } = opts;
  const [search, setSearchRaw] = useState("");
  const [sort, setSortRaw] = useState<SortDir>("newest");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q ? items.filter((it) => searchText(it).toLowerCase().includes(q)) : items.slice();
    return list.sort((a, b) => sortCompare(a, b, sort));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize);

  const setSearch = (v: string) => {
    setSearchRaw(v);
    setPage(0);
  };
  const setSort = (v: SortDir) => {
    setSortRaw(v);
    setPage(0);
  };

  return {
    search,
    setSearch,
    sort,
    setSort,
    page: clampedPage,
    setPage,
    totalPages,
    pageItems,
    filteredCount: filtered.length,
    dotThreshold,
  };
}
