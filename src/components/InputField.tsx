import React, { InputHTMLAttributes } from 'react'
import { FormControl, FormLabel, Input, Textarea,FormErrorMessage } from '@chakra-ui/react';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    textarea?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ label, textarea, size:_, ...props }) => {
    const [field, { error }] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            { textarea ? <Textarea {...props} {...field} id={field.name} placeholder={props.placeholder} /> :<Input {...props} {...field} id={field.name} placeholder={props.placeholder} />}
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}

export default InputField