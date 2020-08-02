import React from "react";

/**
 * 
 * Functional component DayComponent, display week days
 */
const DayComponent = (props) => {
    return (
        <div className="day label">{props.label}</div>
    );
};

export default DayComponent;