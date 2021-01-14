import { dedupExchange, fetchExchange, Exchange, Cache } from "urql"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation, VoteMutationVariables, DeletePostMutation } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { pipe, tap } from 'wonka';
import Router from "next/router"
import { stringifyVariables } from '@urql/core';
import gql from "graphql-tag"
import { isServer } from "./isServer";
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
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        console.log("cache", `${fieldName}(${stringifyVariables(fieldArgs)})`)

        console.log(fieldArgs)
        let hasMore = true
        const results: string[] = []
        const isItInTheCache = cache.resolve(cache.resolveFieldByKey(entityKey, `${fieldName}(${stringifyVariables(fieldArgs)})`) as string, "posts")
        info.partial = !isItInTheCache

        fieldInfos.forEach(fi => {
            const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
            const data = cache.resolve(key, 'posts') as string[]
            const _hasMore = cache.resolve(key, 'hasMore')
            if (!_hasMore) {
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

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields('Quer');
    const fieldInfos = allFields.filter(info => info.fieldName === 'posts');
    fieldInfos.forEach(fi => {
        cache.invalidate("Query", "posts", fi.arguments || {})
    })
    cache.invalidate('Query', 'posts', {
        limit: 15
    })
    cache.inspectFields('Query')
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = ''
    if (isServer()) {
        cookie = ctx ?.req ?.headers ?.cookie
    }
    return {
        url: "https://daily-brew.herokuapp.com/graphql",
        fetchOptions: {
            credentials: "include" as const,
            headers: cookie ? {
                cookie
            } : undefined,
        },
        exchanges: [dedupExchange, cacheExchange({
            keys: {
                PaginatedPosts: () => null,
            },
            resolvers: {
                Query: {
                    posts: cursorPagination(),
                }
            },
            updates: {
                Mutation: {
                    deletePost: (_result, args, cache, info) => {
                        cache.invalidate({
                            __typename: "Post",
                            id: (args as DeletePostMutation).id
                        })
                    },
                    vote: (_result, args, cache, info) => {
                        const { postId, value } = args as VoteMutationVariables
                        const data = cache.readFragment(
                            gql`
                      fragment _ on Post {
                          id
                          points
                          voteStatus
                      }
                      `,
                            { id: postId }
                        )
                        if (data) {
                            console.log(data.voteStatus === value)
                            if (data.voteStatus === value) {
                                return
                            }
                            const newPoints = (data.points as number) + ((!data.voteStatus ? 1 : 2) * value)
                            cache.writeFragment(
                                gql`
                        fragment __ on Post {
                            points
                            voteStatus
                        }
                        `, { id: postId, points: newPoints }
                            )
                        }

                    },
                    createPost: (_result, args, cache, info) => {
                        invalidateAllPosts(cache)
                    },
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
                        invalidateAllPosts(cache)
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
    }
} 