import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function StateTextFields({handleSearch}) {
  const [name, setName] = React.useState('');
  const handleChange = (event) => {
    let search = event.target.value;
    handleSearch(search);
    setName(search);
  };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-name"
        label="Nome da Tarefa"
        fullWidth
        value={name}
        onChange={handleChange}
      />
    </Box>
  );
}