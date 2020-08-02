import React from "react";
import VacationLegend from "../Date/Legend/vacation";
import SickLegend from "../Date/Legend/sick";
import LeaveLegend from "../Date/Legend/leave";

/**
 * Functional component AbsenceViwer, display list of absence legends for Sick, Vacation and Leave
 */
const AbsenceViewer = (props) => {
    const { userSelectedData, limit } = props;
    let legendLimit = 0;
    if (limit) {
        legendLimit = limit;
    } else {
        legendLimit = (userSelectedData && userSelectedData.absenceList) ? userSelectedData.absenceList.length : 0;
    }
    return (
        <>
            {userSelectedData && userSelectedData.absenceList && userSelectedData.absenceList.map((absence, i) => {
                return i <= legendLimit && < React.Fragment key={absence.id} >
                    {absence.type === 'vacation' && <VacationLegend absence={absence}></VacationLegend>}
                    {absence.type === 'sickness' && <SickLegend absence={absence}></SickLegend>}
                    {absence.type !== 'vacation' && absence.type !== 'sickness' && <LeaveLegend absence={absence}></LeaveLegend>}
                </React.Fragment>
            })}
            <div className="clearfix"></div>
        </>
    );
};

export default AbsenceViewer;