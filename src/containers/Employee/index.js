import React, { useRef, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import FileSaver from 'file-saver';
import ErrorComponent from '../../utilities/Error';
import * as helper from './utility';
import * as AppConstants from "../../config/appConstants";
import "./styles.css";

const COLUMNS = ["Name", "Absence Type", "Start Date", "End Date", "Created On", "Approved On", "Status"];

/**
 * 
 * Functional Stateful component Employee, handles user specific absence request
 */
const Employee = (props) => {
    window.scrollTo({ top: 0, behavior: `smooth` });
    const { queryUserId } = props;
    const [error, setErrorMessage] = useState(null);
    const records = useRef([]);
    //populate records
    const calendarData = JSON.parse(localStorage.getItem("calendarData"));
    records.current = useMemo(() => {
        return calendarData && calendarData.calendarData && calendarData.calendarData.filter(data => {
            return queryUserId && queryUserId === data.userId.toString();
        });
    }, [calendarData, queryUserId]);


    /**
 *  Handle ICA file export action
 */
    const handleExport = () => {
        setErrorMessage(null);
        //calling helper method to generate ICA file
        helper.generateICAByUser(calendarData, queryUserId)
            .then(file => {
                if (file) {
                    FileSaver.saveAs(file);
                }
            })
            .catch(err => {
                setErrorMessage(AppConstants.GENERIC_ERROR_MESSAGE);
            });
    }

    return (
        <div className="container employee-record">
            <div className="pt-2">
                <h4 className="font-weight-bold text-uppercase">{AppConstants.EMP_ABSENCE_CALENDAR}</h4>
            </div>

            {error && <ErrorComponent errorMessage={error}></ErrorComponent>}

            <article className="float-right mt-2 mr-1">
                <Button className="btn app-btn"
                    disabled={records.current.length < 1}
                    onClick={handleExport}>
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    <span className="pl-1">Export</span>
                </Button>
            </article>
            <div className="clearfix"></div>
            <Table bordered hover responsive="sm md lg xl" className="mt-4 employee-table">
                <thead>
                    <tr>
                        {COLUMNS.map((col, i) => {
                            return <th key={col + i}>{col}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                    {records.current.length < 1 &&
                        <tr>
                            <td colspan={COLUMNS.length}>{AppConstants.NO_RECORDS}</td>
                        </tr>}
                    {records.current && records.current.map((emp) => {
                        return <tr key={emp.id}>
                            <td className="text-capitalize">{emp.employeeData.name}</td>
                            <td className="text-capitalize">{emp.type}</td>
                            <td>{emp.startDate ? new Date(emp.startDate).toDateString() : null}</td>
                            <td>{emp.endDate ? new Date(emp.endDate).toDateString() : null}</td>
                            <td>{emp.createdAt ? new Date(emp.createdAt).toDateString() : null}</td>
                            <td>{emp.confirmedAt ? new Date(emp.confirmedAt).toDateString() : 'NA'}</td>
                            <td>{emp.rejectedAt ?
                                <><span>{AppConstants.REJECTED}</span><i className="fa fa-thumbs-down status-icon pl-1" aria-hidden="true"></i></> :
                                <><span>{AppConstants.APPROVED}</span><i className="fa fa-thumbs-up status-icon pl-1" aria-hidden="true"></i></>
                            }</td>
                        </tr>
                    })}
                </tbody>
            </Table>
            <div className="row">
                <div className="col">
                    <Link to="/" role="button" className="btn app-btn">Back to Home</Link>
                </div>
            </div>
        </div >
    );
};

export default Employee;