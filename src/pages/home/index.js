import  React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ModalCreateTask from '../../components/modal/modal-create-task';
import TableTask from '../../components/table';
import Menu from '../../components/menu';
import API from '../../services/api';

function Home() {
  const [tasks, setTask] = useState([]);
  const getListTask = async (search) => {
    let response = [];
    if(typeof search != 'undefined') {
      response = await API.get('list-tasks?name='+search);
    }else{
      response = await API.get('list-tasks');
    }
    setTask(response.data.task);
  }
  return (
    <Box>
      <CssBaseline />
      <Menu />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: '100%'} }}
      >
        <ModalCreateTask editar={false} task={[]}  getListTask={getListTask}/>
        <TableTask getListTask={getListTask} tasks={tasks}/>
      </Box>
    </Box>
  );
}

Home.propTypes = {
  window: PropTypes.func,
};

export default Home;