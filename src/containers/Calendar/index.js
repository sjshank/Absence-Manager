import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import FileSaver from 'file-saver';
import DateComponent from "../../components/Date";
import DayComponent from "../../components/Day";
import Filter from "../../components/Filter";
import Employee from "../Employee";
import DatePickerComponent from "../../components/DatePicker";
import ModalComponent from "../../utilities/Modal";
import AbsenceViewer from "../../components/AbsenceViewer";
import ErrorComponent from "../../utilities/Error";
import InfoComponent from "../../utilities/Info";
import { readMembersJson, readAbsenceJson } from '../../utilities/FileUtility';
import { reducer as calendarReducer } from "./reducers";
import * as helper from './utility';
import * as actionTypes from './actionTypes';
import * as AppConstants from "../../config/appConstants";
import "./styles.css";

//Initial calendar state
const Initial_State = {
    months: [],
    years: [],
    filteredDates: [],
    originalDates: [],
    selectedMonth: '',
    selectedYear: '',
    selectedFilter: {
        filterBy: ''
    },
    customStartDate: null,
    customEndDate: null,
    error: null
};

/**
 * Functinal Stateful component Calendar, load and populate calendar dates.
 * Dispatch necessary actions to load, update, filter calendar section as per user acitvites.
 * Initiate initial state of application and uses react hooks to handle actions.
 */
const Calendar = () => {
    //State for calendar view
    const [calendarState, dispatchCalendarActions] = useReducer(calendarReducer, Initial_State);
    //Holds employeedetails which includes absence and personal data
    const employeeDetailsRef = useRef([]);
    //Holds modal state
    const [show, setShow] = useState(false);
    //Holds filter keyword
    const filterByRef = useRef("");
    //Holds user selected Date object
    const userSelectedDateObject = useRef({});
    //Populate query params
    const query = new URLSearchParams(useLocation().search);

    //Load and populate calendar with dates, months, years and absence details using JSON files
    useEffect(() => {
        setShow(false);
        try {
            if (localStorage) {
                localStorage.removeItem("calendarData"); //clear locastorage
            }
            //reading employee details
            readMembersJson()
                .then(memberResponse => {
                    if (memberResponse && memberResponse.message === 'Success' && memberResponse.payload) {
                        const membersData = memberResponse.payload;
                        //reading absence details
                        readAbsenceJson()
                            .then(absenceResponse => {
                                if (absenceResponse && absenceResponse.message === 'Success' && absenceResponse.payload) {
                                    const absenceData = absenceResponse.payload;
                                    const result = absenceData.map(absence => {
                                        return {
                                            ...absence,
                                            employeeData: membersData.find(emp => emp.userId === absence.userId)
                                        }
                                    });
                                    //populate employeedetails
                                    employeeDetailsRef.current = {
                                        calendarData: result
                                    }
                                    //dispatch Populate calendar action
                                    dispatchCalendarActions({ type: actionTypes.POPULATE_CALENDAR, data: employeeDetailsRef.current, dateRangeQueryParams: helper.getDateQueryParams(query) })
                                }
                            })
                    }
                }).catch(err => {
                    console.error("Error while reading file", err);
                    dispatchCalendarActions({ type: actionTypes.SET_ERROR });
                });
        } catch (err) {
            console.error("Error while reading file", err);
            dispatchCalendarActions({ type: actionTypes.SET_ERROR });
        }
    }, [dispatchCalendarActions]);

    /**
     *  Handle Month/Year change action. It reloads the calendar dates section
     * @param  selectedOption, option selected by user from Month/Year dropdown
     * @param  operationName, operation name either Month or Year
     */
    const optionSelectionHandler = (selectedOption, operationName) => {
        //dispatch Update calendar action
        dispatchCalendarActions({
            type: actionTypes.UPDATE_AND_POPULATE_CALENDAR,
            selectedOption: selectedOption,
            operationName: operationName,
            data: employeeDetailsRef.current,
            dateRangeQueryParams: helper.getDateQueryParams(query)
        });
    }

    /**
     *  Handle filter change action
     * @param  e, event object
     */
    const filterChangeHandler = (e) => {
        e.preventDefault();
        filterByRef.current = e.currentTarget.value;
        //dispatch Update calendar action
        dispatchCalendarActions({
            type: actionTypes.FILTER_AND_POPULATE_CALENDAR,
            filterBy: e.currentTarget.value,
            dateRangeQueryParams: helper.getDateQueryParams(query)
        });
    }

    /**
     *  Handle ICA file export action
     */
    const handleExport = () => {
        //calling helper method to generate ICA file
        helper.generateICA(employeeDetailsRef.current)
            .then(file => {
                if (file) {
                    FileSaver.saveAs(file);
                }
            })
            .catch(err => {
                dispatchCalendarActions({ type: actionTypes.SET_ERROR });
            });
    }

    /**
     *  Show modal and render all the absence list for seleted data
     */
    const handleShowAllAbsenceData = (selectedData) => {
        try {
            setShow(true);
            selectedData['modalTitle'] = `As on ${selectedData.date.toDateString()}`
            userSelectedDateObject.current = selectedData;
        } catch (err) {
            dispatchCalendarActions({ type: actionTypes.SET_ERROR });
        }
    }

    //close modal
    const handleCloseModal = () => {
        setShow(false);
    }

    return (
        <>
            {!query.get('userId') && <section>
                {/* displays modal */}
                <ModalComponent onCloseModal={handleCloseModal}
                    show={show}
                    title={userSelectedDateObject.current.modalTitle}>
                    <AbsenceViewer userSelectedData={userSelectedDateObject.current}></AbsenceViewer>
                </ModalComponent>
                <div className="container-fluid">
                    <div className="pt-2">
                        <h4 className="font-weight-bold text-uppercase">{AppConstants.ABSENCE_CALENDAR}</h4>
                    </div>

                    {calendarState.error && <ErrorComponent errorMessage={calendarState.error}></ErrorComponent>}

                    <div className="row">
                        <div className="col">
                            <article className="float-lg-left float-md-left mt-2">
                                <Filter defaultFilterBy={filterByRef.current}
                                    onFilterChange={filterChangeHandler}></Filter>
                            </article>
                            <article className="float-right mt-2 mr-1">
                                <Button className="btn app-btn"
                                    onClick={handleExport}>
                                    <i className="fa fa-calendar" aria-hidden="true"></i>
                                    <span className="pl-1">Export</span>
                                </Button>
                            </article>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    {calendarState.customStartDate && calendarState.customEndDate &&
                        <InfoComponent message={`Displaying records from ${calendarState.customStartDate} to ${calendarState.customEndDate}`}></InfoComponent>
                    }
                    <div className="row">
                        <div className="col">
                            {/* section for Month and Year dropdown */}
                            <section className="calendar mt-3" id="calendar">

                                {/* MONTH */}
                                <DatePickerComponent options={calendarState.months}
                                    onOptionSelection={optionSelectionHandler}
                                    selectedOption={calendarState.selectedMonth}
                                    isMonth="true"
                                    parentClass="month-btn"
                                    childClass="months"
                                    customId="months"></DatePickerComponent>

                                {/* YEAR */}
                                <DatePickerComponent options={calendarState.years}
                                    onOptionSelection={optionSelectionHandler}
                                    selectedOption={calendarState.selectedYear}
                                    parentClass="year-btn"
                                    childClass="years"
                                    isMonth="false"
                                    customId="years"></DatePickerComponent>
                                <div className="clearfix"></div>

                                <article className="calendar-dates-section">
                                    {/* section for Week days */}
                                    <div className="days-label-section mt-2 mb-3">
                                        {AppConstants.WEEK_DAYS.map((weekDay, i) => {
                                            return <DayComponent key={weekDay + 1} label={weekDay}></DayComponent>;
                                        })}
                                        <div className="clearfix"></div>
                                    </div>
                                    {/* section for calendar dates */}
                                    <div id="calendarDates" className="dates-label-section mb-3">
                                        {calendarState.filteredDates && calendarState.filteredDates.map((date, i) => {
                                            return <DateComponent key={`${date ? date.dateIndex : null}-${i}`}
                                                dateObject={date}
                                                showAllAbsenceData={handleShowAllAbsenceData}></DateComponent>
                                        })}
                                        <div className="clearfix"></div>
                                    </div>
                                </article>
                            </section>
                        </div>
                    </div>
                </div>
            </section>}
            {/* section for individual employee absence detail */}
            {query.get('userId') && <Employee employeeDetails={employeeDetailsRef.current}
                queryUserId={query.get('userId')}></Employee>}
        </>
    )
}


export default Calendar;