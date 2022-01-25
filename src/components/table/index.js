import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import API from '../../services/api';
import ModalDeleteTask from '../../components/modal/modal-delete-task';
import EditarModalTask from '../../components/modal/modal-create-task';
import ArchiverModalTask from '../../components/modal/modal-archiver-task';
import UnarchiverModalTask from '../../components/modal/modal-unarchive-task';
import AlertMessage from '../alert';
import moment from 'moment';
import 'moment/locale/pt-br';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function TableTaskList({getListTask, tasks}) {
  const [notification, setNotification] = useState(false);
  const [type, setType] = useState();
  const [message, setMessage] = useState();
  useEffect(() => {
    getListTask();
  }, []);

  const handleUpdateDone = async (value, id) => {
    const response = await API.post('update-task', {id : id, done: value});
    setNotification(true);
    setMessage('Atividade atualizada com sucesso!');
    setType('success');
    getListTask();
  }
  const handleArchiverTask = async (value, id) => {
    await API.post('update-task', {id : id, hide: !value});
    if(!value == true ){
      setMessage('Atividade arquivada com sucesso!');
    }else{
      setMessage('Atividade desarquivada com sucesso!');
    }
    setNotification(true);
    setType('success');
    getListTask();
  }
  return (
    <>
      <AlertMessage setOpen={setNotification} open={notification} message={message} type={type}/>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Nome da Task</StyledTableCell>
              <StyledTableCell align="right">Data de vencimento</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks?.length > 0 ? tasks.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  <Checkbox defaultChecked={row.done == 1 ? true : false} value={row.done} color="success" onChange={(e) => handleUpdateDone(e.target.checked,row._id)} />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">Exp: {moment(row.duedate).fromNow()}</StyledTableCell>
                {row.done == 1 && moment(row.duedate).diff(moment(), 'days') < 0 ? (
                  <StyledTableCell align="right"><Chip  color="error" label="Done" /></StyledTableCell>
                ) 
                : row.done == 1 ? (
                  <StyledTableCell align="right"><Chip  color="success" label="Done" /></StyledTableCell>
                ) : (
                  <>
                  {moment(row.duedate).diff(moment(), 'days') < 0 ? (
                    <StyledTableCell align="right"><Chip color="error" label="Expirado" /></StyledTableCell>

                  ): (
                    <StyledTableCell align="right"><Chip label="primary" color="primary" label="Aberto" /></StyledTableCell>

                  )}
                  </>
                )}
                <StyledTableCell align="right">
                  <Grid container>
                    <Grid item xs={8}>
                      <EditarModalTask editar={true} task={row} getListTask={getListTask}/>
                    </Grid>
                    <Grid item xs={2}>
                      <ModalDeleteTask task={row} getListTask={getListTask} />
                    </Grid>
                    <Grid item xs={2}>
                      {row.done == 1 && row.hide == 0 &&(
                        <ArchiverModalTask handleArchiverTask={handleArchiverTask} task={row}/>    
                      )}
                      {row.done == 1 && row.hide == 1 &&(
                        <UnarchiverModalTask handleUnarchiveTask={handleArchiverTask} task={row}/>    
                      )}
                    </Grid>
                  </Grid>
                </StyledTableCell>
                </StyledTableRow>
            )) : (
              <StyledTableRow>
                <StyledTableCell >
                  Nenhuma task encontrada.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}