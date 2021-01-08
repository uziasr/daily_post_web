import React, { useEffect } from 'react'
import Wrapper from '../components/Wrapper';
import { Formik, Form } from 'formik';
import login from './login';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router"
import InputField from '../components/InputField';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';




const CreatePost: React.FC<{}> = ({ }) => {
    const router = useRouter()
    const [, createPost] = useCreatePostMutation()

    useIsAuth()
    
    return (
        <Layout variant="small">
            <Formik
                initialValues={{ title: "", text: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const { error } = await createPost({ input: values })
                    if (!error) {
                        router.push("/")
                    }
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
                        <Button mt={4} type="submit">Create Post</Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost)
