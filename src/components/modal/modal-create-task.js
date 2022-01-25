import React, {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import EditorDescription from '../editor';
import AlertMessage from '../alert';
import FilterTask from '../filters';
import API from '../../services/api';
import moment from 'moment';
import 'moment/locale/pt-br';
export default function FormDialog({editar, task, getListTask}) {
  moment.locale('pt-br'); 
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [type, setType] = useState();
  const [id, setId] = useState(task?._id);
  const [message, setMessage] = useState();
  const [duedate, setDuedate] = useState(task?.duedate);
  const [name, setName] = useState(task?.name);
  const [description, setDescription] = useState(task?.description);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {

    try {

      const response = await API.post('create-task', {name, description, duedate});

      if(response){
        if(response.status === 202){
          setNotification(true);
          setMessage(response.data?.errors[0].msg);
          setType('error');
        }else{
          setNotification(true);
          setMessage('Sucesso ao cadastrar a sua tarefa');
          setType('success');
          setOpen(false);
          getListTask();
        }

      }
    } catch (error) {
 
       setNotification(true);
       setMessage('Ocorreu um erro ao cadastrar');
       setType('error');
       setOpen(false);
    }

  };
  const handleUpdate = async () => {

    try {

      const response = await API.post('update-task', {id, name, description, duedate});
      if(response){
        if(response.status === 202){
          setNotification(true);
          setMessage(response.data?.errors[0].msg);
          setType('error');
        }else{
          setNotification(true);
          setMessage('Sucesso ao atualizar a sua tarefa');
          setType('success');
          getListTask();
          setOpen(false);
        }
      }
    } catch (error) {
       setNotification(true);
       setMessage('Ocorreu um erro ao cadastrar');
       setType('error');
       setOpen(false);
    }

  };
  const handleSearch = (search) => {
    getListTask(search)
  };
  return (
    <div>
      <AlertMessage setOpen={setNotification} open={notification} message={message} type={type}/>
      {!editar ? (
        <>
        <Typography variant="h5" component="h1">
          TODO List Backlog
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <FilterTask handleSearch={handleSearch}/>
          </Grid>
          <Grid item xs={2}>
              <Button variant="outlined" onClick={handleClickOpen} style={{ marginTop: 10, marginBottom: 10, height: 55, width:'100%'}}>
                  Criar nova Task
              </Button>
          </Grid>
        </Grid>
        </>
      ) : (
          <EditIcon onClick={handleClickOpen} />
      )}
      <Dialog open={open} onClose={handleClose}>
          {!editar ? (
            <DialogTitle>Adicionar uma nova Task</DialogTitle>
          ) : (
            <DialogTitle>Atualizar Task: {task?.name}</DialogTitle>
          )}
        <DialogContent>
          <DialogContentText>
            Aqui voce irá cria uma ativade, detalhe bem sua atividade pois ajuda bastante durante os testes e o desenvolvimento!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome da Task"
            type="text"
            fullWidth
            value={name}
            style={{marginBottom:10}}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
            required
            variant="outlined"
          />
          <DialogContentText>
            Que tal me contar um pouco da sua atividade?
          </DialogContentText>
          <label></label>
          <EditorDescription setDescription={setDescription} initialValue={description} style={{marginBottom:10}}/>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              renderInput={(props) => <TextField 
                variant="outlined"
                fullWidth
                style={{marginTop:10}}
                {...props} 
              />}
              label="Data de vencimento"
              placeholder="Data de vencimento"
              value={duedate}
              onChange={(newValue) => {
                setDuedate(newValue);
              }}
              required

            />
          </LocalizationProvider>
           <FormHelperText id="component-helper-text">
            {`A sua atividade expira ${moment(duedate).locale('pt-br').fromNow()}.`} 
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {!editar ? (
            <Button onClick={handleSubmit}>Cadastrar</Button>

          ) : (
            <Button onClick={handleUpdate}>Atualizar</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}