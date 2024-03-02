"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Props = {
  key: string;
  initialValue?: string;
};

type UseQueryParamState = {
  setValue: (value: string | null) => void;
  value: string | null;

  /** returns a URL where the given key-value query param is removed */
  getClearedUrl: () => string;

  clearUrl: () => void;
};

export const useQueryParamState = ({
  key,
  initialValue,
}: Props): UseQueryParamState => {
  const [value, setValue] = useState(initialValue ?? null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getClearedUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

    return `${pathname}?${params.toString()}`;
  }, [key, pathname, searchParams]);

  const clearUrl = useCallback(() => {
    setValue(null);
    router.push(getClearedUrl());
  }, [router, getClearedUrl]);

  // update query params without overwriting other params
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      if (value === null) {
        return getClearedUrl();
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams, getClearedUrl]
  );

  const setQueryParam = useCallback(
    (value: string | null) => {
      const newUrl = createQueryString(key, value);
      router.push(`${pathname}?${newUrl}`);
    },
    [createQueryString, key, pathname, router]
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const paramValue = params.get(key);

    if (paramValue) {
      setValue(paramValue);
    } else {
      setValue(null);
    }
  }, [key, searchParams]);

  return {
    setValue: setQueryParam,
    value,
    getClearedUrl,
    clearUrl,
  };
};
