import API from '../services/api';

export async function getListTask(){
    const response = await API.get('list-tasks');
    return response.data.task;
}