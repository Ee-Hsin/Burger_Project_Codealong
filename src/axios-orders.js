import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-3c809-default-rtdb.firebaseio.com/'
});

export default instance;