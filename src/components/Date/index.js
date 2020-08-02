import React from "react";
import AbsenceViewer from "../AbsenceViewer";
import "./styles.css";

/**
 *
 * Functional component DateComponent, display each date section inside calendar.
 */
const DateComponent = (props) => {
    const { dateObject } = props;
    return (
        <div className={dateObject && dateObject.date ? 'day' : 'day blank'}>
            <span id="dateIndex" className="p-2 float-left font-weight-bold">{dateObject ? dateObject.dateIndex : null}</span>
            <div className="clearfix"></div>
            {/* Iterate list of absence for given date */}
            <AbsenceViewer userSelectedData={dateObject} limit="1"></AbsenceViewer>
            {
                dateObject && dateObject.absenceList && dateObject.absenceList.length > 2 &&
                <div className="float-right pt-0 pr-2" role="button">
                    <i id="chevronDownIcon" className="fa fa-chevron-circle-down" title="View All" aria-hidden="true" onClick={() => props.showAllAbsenceData(dateObject)}></i>
                </div>
            }
            <div className="clearfix"></div>
        </div >
    );
};

export default DateComponent;