import React, {useState, forwardRef} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AlertMessage from '../alert';
import API from '../../services/api';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalDeleteTask({task, getListTask}) {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [type, setType] = useState();
  const [message, setMessage] = useState();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async (id) => {

    try {

      const response = await API.post('delete-task', {id});
      if(response){
        if(response.status === 200){
          
          setNotification(true);
          setMessage(response.data?.msg);
          if(response.data.error == true ){
            setType('error');
          }else{
            setType('success');
            getListTask();

          }
          setOpen(false);
        }else{
          setNotification(true);
          setMessage(response.data?.errors[0].msg);
          setType('error');
          setOpen(false);

        }
      }
    } catch (error) {
       setNotification(true);
       setMessage('Ocorreu um erro ao deletar');
       setType('error');
       setOpen(false);
    }

  };
  return (
    <div>
      <AlertMessage setOpen={setNotification} open={notification} message={message} type={type}/>
      <DeleteForeverIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Deseja excluir essa atividade?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Se deseja continuar com a exclusão dá ativida clique em confirmar e todos os dados desta atividade serão excluidos!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => handleDelete(task?._id)}>Excluir Atividade</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}