import { dedupExchange, fetchExchange, Exchange } from "urql"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { pipe, tap } from 'wonka';
import { router } from "websocket";
import Router from "next/router"
import { stringifyVariables } from '@urql/core';
// import { Resolver, Variables, NullArray } from '../types';

export const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error ?.message.includes("not authenticated")) {
                Router.replace("login")
            }
        })
    );
};



export type MergeMode = 'before' | 'after';

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
    mergeMode?: MergeMode;
}

const cursorPagination = (): Resolver => {

    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        console.log(entityKey, fieldName)
        const allFields = cache.inspectFields(entityKey);
        console.log(allFields)
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        console.log("cache",`${fieldName}(${stringifyVariables(fieldArgs)})`)

        console.log(fieldArgs)
        let hasMore = true
        const results: string[] = []
        const isItInTheCache = cache.resolve(cache.resolveFieldByKey(entityKey, `${fieldName}(${stringifyVariables(fieldArgs)})`) as string, "posts")
        info.partial = !isItInTheCache
        
        fieldInfos.forEach(fi => {
            const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
            const data = cache.resolve(key, 'posts') as string []
            const _hasMore = cache.resolve(key, 'hasMore')
            if (!_hasMore){
                hasMore = _hasMore as boolean
            }
            results.push(...data)
        })

        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results
        }
    };
};

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:9000/graphql",
    fetchOptions: {
        credentials: "include" as const
    },
    exchanges: [dedupExchange, cacheExchange({
        keys: {
            PaginatedPosts:()=>null,
        },
        resolvers: {
            Query: {
                posts: cursorPagination(),
            }
        },
        updates: {
            Mutation: {
                logout: (_result, args, cache, info) => {
                    betterUpdateQuery<LogoutMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        () => ({ me: null })
                    )
                },
                login: (_result, args, cache, info) => {
                    betterUpdateQuery<LoginMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.login.errors) {
                                return query
                            } else {
                                return {
                                    me: result.login.user
                                }
                            }
                        }
                    )
                },
                register: (_result, args, cache, info) => {
                    betterUpdateQuery<RegisterMutation, MeQuery>(
                        cache,
                        { query: MeDocument },
                        _result,
                        (result, query) => {
                            if (result.register.errors) {
                                return query
                            } else {
                                return {
                                    me: result.register.user
                                }
                            }
                        }
                    )
                }
            }
        }
    }), errorExchange, ssrExchange, fetchExchange]
}) 