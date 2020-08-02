import React from 'react';
import './styles.css';

/**
 * 
 * Functional component InfoComponent, renders info alert bar
 */
const InfoComponent = (props) => {
    return (
        <div className="alert info-message mt-3 mb-0">
            <i className="fa fa-info-circle pr-1" aria-hidden="true"></i>
            <label className="pb-0 mb-0">{props.message}</label>
        </div>
    );
};

export default InfoComponent;