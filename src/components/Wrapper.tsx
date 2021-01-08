import React from 'react'
import { Box } from '@chakra-ui/react';

export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
    variant?: WrapperVariant
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
    return (
        <Box
            maxWidth={variant === "regular" ? "800px" : "400px"}
            mx="auto"
            w="100%"
            mt={8}
        >
            {children}
        </Box>
    );
}

export default Wrapper