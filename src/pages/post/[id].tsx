import React from 'react'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Layout } from '../../components/Layout';
import { Heading, Box } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import { useMeQuery } from '../../generated/graphql';



export const Post = ({ }) => {
        const [{data, error, fetching}] = useGetPostFromUrl()
        const [{data: meData}] = useMeQuery()
        
        if (fetching) {
                return (
                        <Layout>
                                <div>...Loading</div>
                        </Layout>
                );
        }

        if(error) {
                return <div>{error.message}</div>
        }

        if(!data?.post) {
                return <Layout>
                        <Box>could not find post</Box>
                </Layout>
        }

        return (
                <Layout>
                       <Heading mb={4}>{data?.post?.title}</Heading>
                       <Box mb={4}>{data?.post?.text}</Box>
                       {meData?.me?.id !== data?.post?.creator.id ? null : <Box ml="auto"><EditDeletePostButtons id={data.post.id}/></Box>}
                </Layout>
        )

        
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)