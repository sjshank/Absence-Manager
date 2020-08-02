import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * 
 * Functional component Sick, display sick legend
 */
const SickLegend = (props) => {
    const { absence } = props;
    return (
        <Link className="sickness-link" to={"?userId=" + absence.userId}>
            <div id="sickLegend" className="legend sickness-legend mb-2 pl-2 text-left" title="">
                <i className="fa fa-user pr-1" aria-hidden="true"></i>
                {absence.employeeData.name} is sick
                                </div>
        </Link>
    );
};

export default SickLegend;