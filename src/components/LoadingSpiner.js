import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import styles from "./loadingspiner.module.css"

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function LoadingSpiner(props) {
    const { promiseInProgress } = usePromiseTracker();

    return (
        <div>
            {
                (promiseInProgress === true) ?
                    <div className={styles.popupBox}>
                        <div className={styles.box}>
                            <Loader
                                type="Rings"
                                color="var(--button-primary-color)"
                                height={100}
                                width={100}
                                timeout={60000} //1 min
                            />
                            Loading...
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
};
