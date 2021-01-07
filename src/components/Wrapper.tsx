import React from 'react'
import { Box } from '@chakra-ui/react';

interface WrapperProps {
    variant?: 'small' | 'regular'
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