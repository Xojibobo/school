import axios from "axios";

const api = axios.create({
    baseURL: 'https://670e4ba0073307b4ee464482.mockapi.io',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStudents = (teacherId) => {
    return api.get(`/teachers/${teacherId}/students`);
};

export const createStudent = (teacherId, studentData) => {
    return api.post(`/teachers/${teacherId}/students`, studentData);
};

export const editStudent = (teacherId, studentId, studentData) => {
    return api.put(`/teachers/${teacherId}/students/${studentId}`, studentData);
};

export const deleteStudent = (teacherId, studentId) => {
    return api.delete(`/teachers/${teacherId}/students/${studentId}`);
};
