import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/react';
import NextLink from "next/link"
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery()
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
                <Button variant="link">logout</Button>
            </Flex>
        )
    }

    return (
        <Flex p={4} bg="tan">
            <Box ml={"auto"} >
                {body}
            </Box>
        </Flex>
    );
}