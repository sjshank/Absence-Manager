import React from 'react';
import { withRouter } from 'react-router-dom';
import * as appConstants from "../../config/appConstants";
import "./styles.css";

/**
 * 
 * Functional component Header, for application header
 */
const Header = (props) => {
    return (
        <header className="mb-4">
            <div className="container-fluid header-section">
                <div className="row">
                    <div className="col">
                        <div className="">
                            <h1 className="header-label">
                                <span onClick={() => window.location.href = window.location.origin}>{appConstants.APP_TITLE}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="headline-hr" />
        </header>
    );
}

export default withRouter(Header);