import React, { useRef, useState } from 'react';
import DatePickerItem from "./DatePickerItem";
import "./styles.css";

/**
 * 
 * Stateful component DatePickerComponent, displays and handle Months/Years in generic date picker layout.
 */
const DatePickerComponent = (props) => {
    const dropdownElementRef = useRef();
    const [arrowClass, setArrowClass] = useState("fa-chevron-up");

    /**
     *  Handle dropdown toggle action. Respectively load dropdown data
     */
    const toggleDropdown = () => {
        if (dropdownElementRef.current.getAttribute('style') === 'display:block') {
            dropdownElementRef.current.setAttribute('style', 'display:none');
            setArrowClass("fa-chevron-up");
        } else {
            dropdownElementRef.current.setAttribute('style', 'display:block');
            setArrowClass("fa-chevron-down");
        }
    }

    return (
        <div className={`calendar-btn mb-4 ${props.parentClass}`} onClick={toggleDropdown}>
            <span className="text-uppercase">{props.selectedOption ? props.selectedOption : null}</span>
            <div className="float-right">
                <i className={`fa ${arrowClass} pr-1 pr-lg-2 pr-md-2`} aria-hidden="true"></i>
            </div>
            <div id={props.customId} className={`${props.childClass} dropdown`} ref={dropdownElementRef}>
                <div className="row dropdown-container">
                    {props.options && props.options.map((option, i) => {
                        return <DatePickerItem key={option + 1}
                            item={option}
                            isMonth={props.isMonth}
                            selectedOption={props.selectedOption}
                            onOptionSelection={props.onOptionSelection}></DatePickerItem>
                    })}
                </div>
            </div>
        </div>
    );
};

export default DatePickerComponent;