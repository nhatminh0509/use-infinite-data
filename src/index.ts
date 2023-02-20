import { useCallback, useEffect, useState } from "react";
import usePrevious from "./hooks/usePrevious.js";
import Observer from "./utils/Observer.js";
import { deepEqual } from "./utils/function.js";

export type QueryType = object | any;

export type ConfigType = {
  enable?: boolean;
  queryKey?: string;
  limit?: number;
  caller: (...args: any[]) => Promise<any>;
};

const useInfiniteData = (query: QueryType, config: ConfigType) => {
  const {
    enable = true,
    queryKey = null,
    caller = () => null,
    limit = 24,
  } = config;

  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const prePage = usePrevious(page);
  const preQuery = usePrevious(query);

  const getData = useCallback(
    async (p: number) => {
      if (enable) {
        setLoading(true);
        const res = await caller({
          ...query,
          page: p,
          limit,
        });
        if (res?.data) {
          if (p === 1) {
            setItems(res?.data?.items);
          } else {
            setItems((state) => {
              if (state.length + res?.data?.items?.length <= p * limit) {
                return state.concat(res?.data?.items);
              }
              return state;
            });
          }
          setTotal(res?.data?.total);
          setTotalPages(res?.data?.totalPages);
        }
        setLoading(false);
      }
    },
    [enable, limit, query, caller]
  );

  useEffect(() => {
    if (deepEqual(preQuery, query)) {
      if (prePage !== page) {
        getData(page);
      }
    } else {
      if (page === 1) {
        getData(page);
      } else {
        setPage(1);
      }
    }
  }, [getData, page]);

  const nextPage = useCallback(() => {
    setPage((state) => state + 1);
  }, []);

  const refetchData = useCallback(() => {
    if (page === 1) {
      getData(page);
    } else {
      setPage(1);
    }
  }, [getData, page]);

  useEffect(() => {
    if (queryKey) {
      Observer.on(queryKey, refetchData);
      return () => Observer.removeListener(queryKey, refetchData);
    }
  }, [queryKey, refetchData]);

  return {
    loading,
    items,
    total,
    totalPages,
    page,
    hasMore: items.length < total,
    nextPage,
  };
};

export const invalidateQueries = (queryKey: string) => {
  Observer.emit(queryKey)
}

export default useInfiniteData;
