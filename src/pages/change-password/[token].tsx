import { NextPage } from 'next';
import Wrapper from '../../components/Wrapper';
import { Formik, Form } from 'formik';
import login from '../login';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from "next/router"
import InputField from '../../components/InputField';
import { Box, Button, Link, Flex } from '@chakra-ui/react';
import { useChangePasswordMutation } from '../../generated/graphql';
import { useState } from 'react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from "next/link"

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [_, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState()
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({ 
                        newPassword: values.newPassword, 
                        token : typeof router.query.token === "string" ? router.query.token : ""
                    })
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                        // setErrors()
                    } else if (response.data ?.changePassword.user) {
                        //worked
                        router.push("/")
                    }
                }}>
                {(isSubmitting) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="New Password"
                            label="new password"
                            type="password"
                        />
                        {tokenError ? 
                        <Flex>
                            <Box mr={2} style={{color:"red"}}>{tokenError}</Box>
                            <NextLink href="/forgot-password">
                                <Link>Get new Link</Link>
                            </NextLink>
                        </Flex> 
                        : null}
                        <Button mt={4} color="green" type="submit">change password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}


export default withUrqlClient(createUrqlClient, {ssr: false})(ChangePassword)
