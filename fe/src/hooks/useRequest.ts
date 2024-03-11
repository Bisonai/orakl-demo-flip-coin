import useSWR, { BareFetcher, SWRConfiguration } from 'swr';

//https://stackoverflow.com/questions/66886014/type-safe-data-fetching-hooks-with-swr-and-the-fetch-api
interface DataPayload<T> {
  [key: string]: T;
}

interface DataResponse<T> {
  data?: T;
  isLoading: boolean;
  isError: any;
}

function useRequest<T>(keyAndParams: Array<any>, fetcher: BareFetcher<T>, config?: SWRConfiguration): DataResponse<T> {
  const { data, error } = useSWR<T>(keyAndParams, fetcher, config);
  return {
      data,
      isLoading: !data && !error,
      isError: error,
  };
}

export default useRequest;