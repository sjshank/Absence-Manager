import React from 'react';

/**
 * 
 * Functional component Filter, display and triggers filter
 */
const Filter = (props) => {
    return (
        <div className="d-flex mb-2 justify-content-center">
            <div className="pt-1">
                <span className="font-weight-bold">Show :</span>
            </div>
            <div className="pl-1">
                <select title="Filter By Absence Type"
                    className="app-select-input"
                    value={props.defaultFilterBy}
                    onChange={(e) => props.onFilterChange(e)}>
                    <option value="">All Employees</option>
                    <option value="vacation">Employees On Vacation</option>
                    <option value="sickness">Employees On Sick Leave</option>
                </select>
            </div>
        </div>
    );
};

export default Filter;