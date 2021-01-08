import React, { useState } from 'react'
import Wrapper from '../components/Wrapper';
import { Formik, Form } from 'formik';
import forgotPassword from './login';
import { toErrorMap } from '../utils/toErrorMap';
import { router } from 'websocket';
import InputField from '../components/InputField';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgotPasswordMutation } from '../generated/graphql';


const ForgotPassword: React.FC<{}> = ({}) => {
        const [,forgotPassword] = useForgotPasswordMutation()
        const [complete, setComplete] = useState(false)
        return (
                <Wrapper variant="small">
            <Formik
                initialValues={{ email:''}}
                onSubmit={async (values, { setErrors }) => {
                         await forgotPassword({email: values.email})
                        //worked
                        router.push("/")
                    
                }}>
                {(isSubmitting) => (
                complete? 
                <p>If an account with that email exists, we sent you an email</p>
                :
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