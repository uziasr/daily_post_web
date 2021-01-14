import { Box, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps{
    id: number
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id}) => {
        const [,deletePost] = useDeletePostMutation()
        return (
            <Box ml="auto">
                <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                    <IconButton
                        mr={4}
                        ml="auto"
                        aria-label="edit"
                        icon={<EditIcon></EditIcon>}
                    />
                </NextLink>
                <IconButton
                    onClick={()=>deletePost({id})}
                    ml="auto"
                    aria-label="delete"
                    icon={<DeleteIcon></DeleteIcon>}
                />
            </Box>
        );
}

export default EditDeletePostButtons