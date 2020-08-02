import { VCALENDAR, VEVENT } from 'ics-js';

/**
 * Generate ICA calendar file using VCalendar and EEvent class for user specific
 * @param date, Employee absence data
 * @param userId, Employee userid
 */
export const generateICAByUser = (data, userId) => {
    try {
        return new Promise((resolve, reject) => {
            const cal = new VCALENDAR();
            cal.addProp('VERSION', 1)
            cal.addProp('PRODID', 'Crew Master');
            data.calendarData.forEach(data => {
                if (userId && parseInt(userId) === data.userId) {
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
                }
            });
            resolve(cal);
        }).then(response => {
            if (response) {
                return new File([response.toBlob()], "iCal.ics", { type: "data:text/calendar;charset=utf8" });
            }
        }).catch(err => {
            throw new Error("Error while generating ICA file for user");
        })
    } catch (err) {
        console.error("Error while generating ICA file for user  ", err);
    }
}