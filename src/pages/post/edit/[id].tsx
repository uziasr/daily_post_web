import React from 'react'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Layout } from '../../../components/Layout';
import { Formik, Form } from 'formik';
import InputField from '../../../components/InputField';
import { Button, Box } from '@chakra-ui/react';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { useRouter } from 'next/router';



const EditPost = ({}) => {
        const router = useRouter() 
        const postId = useGetIntId()
        const [{data, fetching}] = useGetPostFromUrl()
        const [, updatePost] = useUpdatePostMutation()

        if (fetching) {
            return (
                <Layout>
                    <div>loading...</div>
                </Layout>
            )
        }
        if(!data?.post) {
            return (<Layout>
                    <Box>could not find post</Box>
            </Layout>)
        }
        

        return (
            <Layout variant="small">
            <Formik
                initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async (values, { setErrors }) => {
                    await updatePost({id: postId, ...values})
                    router.push('/')
                }}>
                {(isSubmitting) => (
                    <Form>
                        <InputField
                            name="title"
                            placeholder="title"
                            label="Title"
                        />
                        <InputField
                            name="text"
                            placeholder="text..."
                            label="Body"
                            textarea={true}
                        />
                        <Button mt={4} type="submit">Update Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(EditPost)