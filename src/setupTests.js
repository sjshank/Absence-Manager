// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { shallow, render, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const mockData = {
    calendarData: [
        {
            "admitterId": null,
            "admitterNote": "",
            "confirmedAt": "2016-12-12T18:03:55.000+01:00",
            "createdAt": "2016-12-12T14:17:01.000+01:00",
            "crewId": 352,
            "endDate": "2020-08-04",
            "id": 2353,
            "memberNote": "",
            "rejectedAt": null,
            "startDate": "2020-08-01",
            "type": "vacation",
            "userId": 2664,
            "employeeData": {
                "crewId": 352,
                "id": 2650,
                "image": "http://place-hoff.com/300/400",
                "name": "Mike",
                "userId": 2664
            }
        },
        {
            "admitterId": null,
            "admitterNote": "",
            "confirmedAt": "2016-12-12T18:03:55.000+01:00",
            "createdAt": "2016-12-12T14:17:01.000+01:00",
            "crewId": 352,
            "endDate": "2020-08-04",
            "id": 2351,
            "memberNote": "",
            "rejectedAt": null,
            "startDate": "2020-08-01",
            "type": "sickness",
            "userId": 8447,
            "employeeData": {
                "crewId": 352,
                "id": 9364,
                "image": "http://place-hoff.com/300/400",
                "name": "Marlene",
                "userId": 8447
            }
        }
    ]
}


export { shallow, render, mount, mockData };