import React from 'react';
import './styles.css';

/**
 * 
 * Functional component ErrorComponent, renders error alert bar
 */
const ErrorComponent = (props) => {
    return (
        <div className="alert error-msg" role="alert">
            <i className="fa fa-ban pr-1" aria-hidden="true"></i>
            {props.errorMessage}
        </div>
    );
};

export default ErrorComponent;