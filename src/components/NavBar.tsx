import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/react';
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation,  } from '../generated/graphql';
import { isServer } from "../utils/isServer"
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    })
    let body = null
    if (fetching) {

    } else if (!data ?.me) {
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
                <Button onClick={() => logout()} isLoading={logoutFetching} variant="link">logout</Button>
            </Flex>
        )
    }

    return (
        <Flex position={"sticky"} top={0} zIndex={1} p={4} bg="tan">
            <Box ml={"auto"} >
                {body}
            </Box>
        </Flex>
    );
}