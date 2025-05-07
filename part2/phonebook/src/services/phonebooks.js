import axios from 'axios';

const createPhonebook = (phonebook) => {
    const request = axios.post('http://localhost:3001/persons', phonebook);
    return request.then((response) => response.data);
}

const getAllPhonebooks = () => {
    const request = axios.get('http://localhost:3001/persons');
    return request.then((response) => response.data);
}
const updatePhonebook = (id, phonebook) => {
    const request = axios.put(`http://localhost:3001/persons/${id}`, phonebook);
    return request.then((response) => response.data);
}

const deletePhonebook = (id) => {
    const request = axios.delete(`http://localhost:3001/persons/${id}`);
    return request.then((response) => response.data);
}

const phonebookService = {
    createPhonebook,
    getAllPhonebooks,
    updatePhonebook,
    deletePhonebook
}
export default phonebookService;
