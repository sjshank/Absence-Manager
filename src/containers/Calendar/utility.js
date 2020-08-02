import * as AppConstants from '../../config/appConstants';
import { VCALENDAR, VEVENT } from 'ics-js';

/**
 * Populate Months, Years, Dates and load calendar state
 * @param state, calendar state
 * @param action, actions
 */
export const populateCalendar = (state, action) => {
    try {
        const _dateQueryParams = action.dateRangeQueryParams;
        const _months = Array.from(AppConstants.MONTHS);
        let _dates = [];
        let _year;
        let _month;
        const isValid = isValidDateRange(_dateQueryParams);

        //If query parameters has date range, populate calendar based on startdate and enddate
        if (isValid) {
            const _sDate = _dateQueryParams.startDate; //By default show startdate month calendar
            _month = _sDate.getMonth();
            _year = _sDate.getFullYear();

            //populate calendar dates based on date query params
            _dates = getCalendarDatesPopulated(_month, _year, action.data.calendarData, _dateQueryParams);
        } else {
            const _date = new Date(); //By default show today's date month calendar
            _month = _date.getMonth();
            _year = _date.getFullYear();

            //populate calendar dates based on today's date
            _dates = getCalendarDatesPopulated(_month, _year, action.data.calendarData);
        }

        //save employeedetails in local storage so that on refresh user doesn't loose records
        localStorage.setItem("calendarData", JSON.stringify(action.data));

        return {
            ...state,
            months: _months,
            years: getYearsPopulated(),
            filteredDates: [..._dates],
            originalDates: [..._dates],
            selectedMonth: _months[_month],
            selectedYear: _year,
            customStartDate: isValid ? _dateQueryParams.startDateStr : null,
            customEndDate: isValid ? _dateQueryParams.endDateStr : null,
            error: null
        }
    } catch (err) {
        console.error("Error while populating calendar  ", err);
        return {
            ...state,
            error: AppConstants.GENERIC_ERROR_MESSAGE
        }
    }
};

/**
 * Update calendar dates based on Month/Year selection and load calendar state
 * @param state, calendar state
 * @param action, actions
 */
export const updateCalendar = (state, action) => {
    try {

        const _dateQueryParams = action.dateRangeQueryParams; //date query params from url
        const isValid = isValidDateRange(_dateQueryParams);
        const _selectedFilter = { ...state.selectedFilter }; //current selected filter
        //get month selected by user
        const _month = action.operationName === 'month' ? AppConstants.MONTHS.indexOf(action.selectedOption) : AppConstants.MONTHS.indexOf(state.selectedMonth);
        //get year selected by user
        const _year = action.operationName === 'year' ? action.selectedOption : state.selectedYear;

        //populate fresh calendar dates based on month/year selected by user
        const _dates = getCalendarDatesPopulated(_month, _year, action.data.calendarData, _dateQueryParams);

        return {
            ...state,
            filteredDates: populateAndFilterDatesWithAbsenceList([..._dates], _selectedFilter.filterBy),
            originalDates: [..._dates],
            selectedMonth: action.operationName === 'month' ? action.selectedOption : state.selectedMonth,
            selectedYear: action.operationName === 'year' ? action.selectedOption : state.selectedYear,
            customStartDate: isValid ? _dateQueryParams.startDateStr : null,
            customEndDate: isValid ? _dateQueryParams.endDateStr : null,
            error: null
        }
    } catch (err) {
        console.error("Error while updating calendar  ", err);
        return {
            ...state,
            error: AppConstants.GENERIC_ERROR_MESSAGE
        }
    }
}

/**
 * Update calendar legends based on filter selected by user and load calendar state
 * @param state, calendar state
 * @param action, actions
 */
export const filterAndUpdateCalendar = (state, action) => {
    try {
        return {
            ...state,
            filteredDates: populateAndFilterDatesWithAbsenceList([...state.originalDates], action.filterBy),
            selectedFilter: {
                filterBy: action.filterBy
            },
            error: null
        }
    } catch (err) {
        console.error("Error while executing filter  ", err);
        return {
            ...state,
            error: AppConstants.GENERIC_ERROR_MESSAGE
        }
    }
}

/**
 * set error
 * @param state, calendar state
 * @param action, actions
 */
export const setError = (state, action) => {
    return {
        ...state,
        error: AppConstants.GENERIC_ERROR_MESSAGE
    }
}


/**
 * Generate ICA calendar file using VCalendar and EEvent class. Collect all data and generate file using FileSaver
 * @param date, Employee absence data
 */
export const generateICA = (data) => {
    try {
        return new Promise((resolve, reject) => {
            const cal = new VCALENDAR();
            cal.addProp('VERSION', 1)
            cal.addProp('PRODID', 'Crew Master');
            data.calendarData.forEach(data => {
                const _summary = data.type === 'vacation' ? 'is on vacation' : 'is sick';
                const event = new VEVENT();
                event.addProp('UID');
                event.addProp('DTSTAMP', new Date(data.startDate), { VALUE: 'DATE-TIME' });
                event.addProp('DTSTART', new Date(data.startDate), { VALUE: 'DATE-TIME' });
                event.addProp('DTEND', new Date(data.endDate), { VALUE: 'DATE-TIME' });
                event.addProp('SUMMARY', `${data.employeeData.name} ${_summary}`);
                event.addProp('DESCRIPTION', data.memberNote);
                event.addProp('CREATED', new Date(data.createdAt), { VALUE: 'DATE-TIME' });
                cal.addComponent(event);
            });
            resolve(cal);
        }).then(response => {
            if (response) {
                return new File([response.toBlob()], "iCal.ics", { type: "data:text/calendar;charset=utf8" });
            }
        }).catch(err => {
            throw new Error("Error while generating ICA file");
        })
    } catch (err) {
        console.error("Error while generating ICA file  ", err);
    }
}

/**
 * Parse date range query params from URL
 * @param query, URL query parameter
 */
export const getDateQueryParams = (query) => {
    try {
        let dateRangeQueryParams = {};
        if (query.get('startDate') && query.get('endDate')) {
            dateRangeQueryParams['startDate'] = new Date(query.get('startDate'));
            dateRangeQueryParams['endDate'] = new Date(query.get('endDate'));
            dateRangeQueryParams['startDateStr'] = query.get('startDate');
            dateRangeQueryParams['endDateStr'] = query.get('endDate');
        } else {
            dateRangeQueryParams = null;
        }
        return dateRangeQueryParams;
    } catch (err) {
        console.error("Error parsing date range query params  ", err);
    }
}


//utility for populating calendar dates as per month, year and absence data
const getCalendarDatesPopulated = (month, year, calendarData, dateQueryParams = null) => {
    try {
        const _dates = [];
        const _tmpDate = new Date(year, month, 0);
        const _numOfDays = daysInMonth(month, year);
        const _dayofweek = _tmpDate.getDay();   //find where to start calendar day of week

        //push null for calendar date box which doesn't exist for current month and year
        for (let i = 0; i <= _dayofweek; i++) {
            _dates.push(null);
        }

        for (let i = 0; i < _numOfDays; i++) {
            const _absenceList = [];

            //each calendar box date instance
            const _dateStrInstance = strDateInstance(year, month, i);
            const isValid = isValidDateRange(dateQueryParams);

            //Check dates exist in query params are valid
            if (isValid) {

                //build absence list only if current date instance satisfy date range
                if (Date.parse(_dateStrInstance) >= Date.parse(dateQueryParams.startDateStr)
                    && Date.parse(_dateStrInstance) <= Date.parse(dateQueryParams.endDateStr)) {
                    buildAbsenceListForEachDate(calendarData, _dateStrInstance, _absenceList);
                }
            } else {
                buildAbsenceListForEachDate(calendarData, _dateStrInstance, _absenceList);
            }
            _dates.push({
                'dateIndex': i + 1,
                'date': new Date(year, month, i + 1),
                'absenceList': _absenceList
            });
        }
        return _dates;
    } catch (err) {
        console.error("Error while getCalendarDatesPopulated calendar dates  ", err);
    }
}



//Utility to build absence list for every calendar date which is used to show legends
const buildAbsenceListForEachDate = (calendarData, dateStrInstance, absenceList) => {
    calendarData.forEach((emp) => {
        //check if current calendar date exist between absence dates. If yes, then populate absence list for that date box
        if (Date.parse(dateStrInstance) >= Date.parse(emp.startDate)
            && Date.parse(dateStrInstance) <= Date.parse(emp.endDate)) {
            absenceList.push(emp);
        }
    });
}


//utility to filter and re-populate dates with absence list
const populateAndFilterDatesWithAbsenceList = (originalDates, filterBy) => {
    let _result = [];
    if (filterBy === '') {
        _result = originalDates;
    } else {
        _result = originalDates.map((element) => {
            return {
                ...element,
                absenceList: element ? element.absenceList.filter((emp) => emp.type === filterBy) : null
            }
        });
    }
    return _result;
}

//utility for populating years dropdown data
const getYearsPopulated = () => {
    const _years = [];
    for (let i = AppConstants.START_YEAR; i <= AppConstants.END_YEAR; i++) {
        _years.push(i);
    }
    return _years
}

//get number of days in month
const daysInMonth = (month, year) => {
    const d = new Date(year, month + 1, 0);
    return d.getDate();
}

//get date instance in yyyy-mm-dd string format
const strDateInstance = (year, month, day) => {
    let tempMonth = month + 1;
    tempMonth = (tempMonth && tempMonth < 10) ? tempMonth.toString().padStart(2, '0') : tempMonth.toString()
    let tempDay = day + 1;
    tempDay = (tempDay && tempDay < 10) ? tempDay.toString().padStart(2, '0') : tempDay.toString();
    return `${year}-${tempMonth}-${tempDay}`;
}

//Validate query params
const isValidDateRange = (dateQueryParams) => {
    return dateQueryParams && !isNaN(Date.parse(dateQueryParams.startDateStr)) && !isNaN(Date.parse(dateQueryParams.endDateStr));
}
