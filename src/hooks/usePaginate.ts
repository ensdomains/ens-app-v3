import { QueryHookOptions, useQuery } from "@apollo/client";
import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client/core";
import { useState } from "react";

interface PaginateOptions<TData = any, TVariables = OperationVariables>
  extends QueryHookOptions<TData, TVariables> {
  pageSize: number;
  targetKey?: string;
}

const findTargetFromKey = (key: string, obj: any) => {
  const split = key.split(".");
  if (split.length > 1) {
    return split.reduce((o: any, i: any) => o[i], obj);
  }
  return obj[key];
};

export const usePaginate = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: PaginateOptions<TData, TVariables>
) => {
  const [page, _loadPage] = useState(0);
  const [mergedResults, setMergedResults] = useState<Array<any>>([]);

  const { pageSize, ..._queryOptions } = options;
  const queryOptions: QueryHookOptions<TData, TVariables> = {
    ..._queryOptions,
    variables: <TVariables>(<unknown>{
      ..._queryOptions.variables,
      skip: page * pageSize,
      first: pageSize,
    }),
    onCompleted: (data: any) => {
      setMergedResults((prevResults: any) => [
        ...prevResults,
        ...(options.targetKey
          ? findTargetFromKey(options.targetKey, data)
          : data),
      ]);
    },
  };

  const queryResult = useQuery(query, queryOptions);

  const fetchMore = () =>
    queryResult.refetch({
      skip: page * pageSize + mergedResults.length,
      first: pageSize,
    } as unknown as Partial<TVariables>);

  const loadPage = (reqPage: number) => {
    setMergedResults([]);
    _loadPage(reqPage);
  };

  return { ...queryResult, data: mergedResults, fetchMore, loadPage };
};
