import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link"
import { Link, Stack, Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { rest } from "lodash";
import { title } from "process";
import { useState } from "react";

const Index = () => {
    const [variables, setVariables] = useState({limit: 10, cursor: null as null | string})
    const [{ data, fetching }] = usePostsQuery({
        variables
    })

    if (!fetching && !data){
        return <div>query failed</div>
    }
    return (
        <Layout variant="regular">
            <Flex align={"center"}>
                <Heading>The Daily Post</Heading>
                <NextLink href="/create-post">
                    <Link ml="auto">Create Post</Link>
                </NextLink>
            </Flex>
            <br />
            <Stack spacing={8}>
                {fetching && !data ? <div>loading</div> : data!.posts.posts.map(p =>
                    {
                    return <Box p={5}  shadow="md" borderWidth="1px" {...rest}>
                        <Heading fontSize="xl">{p.title}</Heading>
                        <Text mt={4}>{p.textSnippet + "..."}</Text>
                    </Box>})}
            </Stack>
            {data && data.posts.hasMore? (<Flex>
                <Button onClick={()=>setVariables(
                    {
                        limit:variables.limit, 
                        cursor: data.posts.posts[data.posts.posts.length-1].createdAt
                    }
                    )} m="auto" my={8}>Load More</Button>
            </Flex>): null}
        </Layout>
    )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
