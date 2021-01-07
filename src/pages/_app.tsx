import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { Provider, createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache"
import theme from '../theme'
import { MeDocument, LoginMutation, MeQuery, RegisterMutation, LogoutMutation } from '../generated/graphql'

function betUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
  url: "http://localhost:9000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          betUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result,
            () => ({ me: null })
          )
        },
        login: (_result, args, cache, info) => {
          betUpdateQuery<LoginMutation, MeQuery>(
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
          betUpdateQuery<RegisterMutation, MeQuery>(
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
  }), fetchExchange]
})

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
