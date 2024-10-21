import axios from 'axios';

const BASE_URL = 'https://670e4ba0073307b4ee464482.mockapi.io';

export const getTeachers = () => {
    return axios.get(`${BASE_URL}/teachers`);
};

export const createTeacher = (teacherData) => {
    return axios.post(`${BASE_URL}/teachers`, teacherData);
};

export const updateTeacher = (id, teacherData) => {
    return axios.put(`${BASE_URL}/teachers/${id}`, teacherData);
};

export const deleteTeacher = (id) => {
    return axios.delete(`${BASE_URL}/teachers/${id}`);
};
