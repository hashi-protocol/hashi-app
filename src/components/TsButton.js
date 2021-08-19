import React from "react";
import Button from "./Button"

const TsButton = ({ children, onClick, ...props }) => {

    return (
        <Button onClick={onClick}>{children}</Button>
    )
}

export default TsButton;
