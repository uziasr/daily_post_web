import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery, useMeQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link"
import { Link, Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { rest } from "lodash";
import { useState } from "react";
import { UpdootSection } from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";


const Index = () => {
    const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string })
    const [{ data, error, fetching }] = usePostsQuery({
        variables
    })
    const [{ data: meData }] = useMeQuery()
    if (!fetching && !data) {
        return <div>
            <div>query failed</div>
            <div>{error.message}</div>
        </div>
    }
    return (
        <Layout variant="regular">
            <Flex align={"center"}>
                <Heading>Fresh Brew</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            <br />
            <Stack spacing={8}>
                {fetching && !data ? <div>loading</div> : data!.posts.posts.map(p => !p ? null :
                    (<Flex p={5} shadow="md" borderWidth="1px" {...rest}>
                        <UpdootSection post={p} />
                        <Box flex={1}>
                            <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                                <Link>
                                    <Heading fontSize="xl">{p.title}</Heading>
                                </Link>
                            </NextLink>
                            <Text>Posted by {p.creator.username}</Text>
                            <Flex >
                                <Text flex={1} mt={4}>{p.textSnippet}</Text>
                                {meData ?.me ?.id !== p.creator.id ? null : <Box ml="auto"><EditDeletePostButtons id={p.id} /></Box>}
                            </Flex>
                        </Box>
                    </Flex>
                    ))}
            </Stack>
            {data && data.posts.hasMore ? (<Flex>
                <Button onClick={() => setVariables(
                    {
                        limit: variables.limit,
                        cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
                    }
                )} m="auto" my={8}>Load More</Button>
            </Flex>) : null}
        </Layout>
    )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
