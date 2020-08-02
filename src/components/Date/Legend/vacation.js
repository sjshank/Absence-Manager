import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * 
 * Functional component Vacation, display vacation legend
 */
const VacationLegend = (props) => {
    const { absence } = props;
    return (
        <Link className="vacation-link" to={"?userId=" + absence.userId}>
            <div id="vacationLegend" className="legend vacation-legend mb-2 pl-2 text-left" title="">
                <i className="fa fa-user pr-1" aria-hidden="true"></i>
                {absence.employeeData.name} is on vacation
                        </div>
        </Link>
    );
};

export default VacationLegend;