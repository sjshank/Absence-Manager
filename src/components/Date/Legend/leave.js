import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

/**
 * 
 * Functional component Leave, display leave legend
 */
const LeaveLegend = (props) => {
    const { absence } = props;
    return (
        <Link className="leave-link" to={"?userId=" + absence.userId}>
            <div id="leaveLegend" className="legend leave-legend mb-2 pl-2 text-left" title="">
                <i className="fa fa-user pr-1" aria-hidden="true"></i>
                {absence.employeeData.name} is on leave
                                </div>
        </Link>
    );
};

export default LeaveLegend;