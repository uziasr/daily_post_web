import React from 'react'
import Wrapper from '../components/Wrapper';
import { Formik, Form } from 'formik';
import login from './login';
import { toErrorMap } from '../utils/toErrorMap';
import { router } from 'websocket';
import InputField from '../components/InputField';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';


const ForgotPassword: React.FC<{}> = ({}) => {
        return (
                <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    if (response.data ?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data ?.login.user) {
                        //worked
                        router.push("/")
                    }
                }}>
                {(isSubmitting) => (
                    <Form>
                        <InputField
                            name="email"
                            placeholder="email"
                            label="email"
                            type="email"
                        />
                        <Button mt={4} type="submit">Forgot Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)