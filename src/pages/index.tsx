import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link"
import { Link } from "@chakra-ui/react";

const Index = () => {
    const [{ data }] = usePostQuery()

    return (
        <Layout variant="regular">
            <NextLink href="/create-post">
                <Link>Create Post</Link>
            </NextLink>
            <br />
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
        </Layout>
    )
}
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
