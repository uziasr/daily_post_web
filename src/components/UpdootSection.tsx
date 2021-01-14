import React from 'react'
import { Flex, IconButton } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { PostsQuery, PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [, vote] = useVoteMutation()

    return (
        <Flex direction="column" mr={4} align="center" alignItems="center" justifyContent="center" alignContent="center">
            <IconButton onClick={() => {
                if (post.voteStatus === 1) return 
                vote({ postId: post.id, value: 1 })
            }} aria-label="up-vote" icon={<ChevronUpIcon name="chevron-up" size="24px" />} />
            {post.points}
            <IconButton onClick={() => {
                if (post.voteStatus === -1) return 
                vote({ postId: post.id, value: -1 })}} aria-label="down-vote" icon={<ChevronDownIcon name="chevron-up" size="24px" />} />
        </Flex>
    );
}