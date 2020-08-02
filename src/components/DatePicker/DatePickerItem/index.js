import React from 'react';

/**
 * 
 * Functional component DatePickerItem, display each Month/Year in datepicker dropdown
 */
const DatePickerItem = (props) => {
    const { item, selectedOption } = props;
    return (
        <div className={selectedOption === item ? 'selected dropdown-item col-lg-4 col-md-4 col-sm-12' : 'dropdown-item col-lg-4 col-md-4 col-sm-12'}
            onClick={(e) => props.onOptionSelection(item, props.isMonth === 'true' ? 'month' : 'year')}>
            <p className="mb-0 pb-0">{item}</p>
        </div>
    );
};

export default DatePickerItem;