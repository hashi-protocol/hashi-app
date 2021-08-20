import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function LoadingSpiner(props) {
    const { promiseInProgress } = usePromiseTracker();

    return (
        <div>
            {
                (promiseInProgress === true) ?
                    <Loader
                        type="Rings"
                        color="var(--button-primary-color)"
                        height={100}
                        width={100}
                        timeout={60000} //1 min
                    />
                    :
                    null
            }
        </div>
    )
};
