import React from 'react'
import { Box, Link, Flex, Button, Heading } from '@chakra-ui/react';
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation,  } from '../generated/graphql';
import { isServer } from "../utils/isServer"
import {useRouter} from "next/router"
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const router = useRouter()
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })
    let body = null
    if (fetching) {

    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/register">
                    <Link mr={2} color="white">register</Link>
                </NextLink>
                <NextLink href="login">
                    <Link color="white">login</Link>
                </NextLink>
            </>
        )

    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button onClick={async () => {
                    await logout()
                    router.reload()
                    }} isLoading={logoutFetching} variant="link">logout</Button>
            </Flex>
        )
    }

    return (
        <Flex position={"sticky"} top={0} zIndex={1} p={4} bg="tan" align="center">
            <NextLink href="/">
                <Link>
                    <Heading>The Daily Post</Heading>
                </Link>
            </NextLink>
            <Box ml={"auto"} >
                {body}
            </Box>
        </Flex>
    );
}