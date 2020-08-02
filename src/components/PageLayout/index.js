import React from 'react';

/**
 * 
 * Functional component Pagelayout, overall app layout
 */
const PageLayout = (props) => {
    return (
        <main className="mb-5">
            {props.children}
        </main>
    );
};

export default PageLayout;