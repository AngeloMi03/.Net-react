import React from "react";
import { Message} from "semantic-ui-react";

interface Props{
    errors : any
}

export default function ValidationError({errors}: Props){
    return(  
        <Message error>
        
        {errors && (
            errors.map((error : string, i : any) => (
                <Message.Item key={i}>{error}</Message.Item>
            ))
        )}
        </Message>
    )
}