import absences from "../../json_files/absences.json";
import members from "../../json_files/members.json";

export const readAbsenceJson = () => new Promise((resolve, reject) => {
    if (absences) {
        return resolve(absences);
    } else {
        reject("Error ! File not found.");
    }
});

export const readMembersJson = () => new Promise((resolve, reject) => {
    if (members) {
        return resolve(members);
    } else {
        reject("Error ! File not found.");
    }
});