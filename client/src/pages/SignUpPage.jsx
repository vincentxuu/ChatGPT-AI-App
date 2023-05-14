import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { userSignUp } from '../api/user.api';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';


const TextFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#94989b',
    },
  },
}

const SignUpPage = () => {
  const navigate = useNavigate();

  const [isRequest, setIsRequest] = useState(false)

  const form = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      username: yup.string()
        .required('username is required')
        .min(6)
        .max(15),
      password: yup.string()
        .required('password is required')
        .min(8),
      confirmPassword: yup.string()
        .required('Confirm password is required')
        .min(8)
        .oneOf([yup.ref('password')], 'Confirm password not match')
    }),
    onSubmit: (values) => onSignUp(values)
  })

  const onSignUp = async ({ username, password }) => {
    if (isRequest) return;
    setIsRequest(true);

    const { response, err } = await userSignUp({ username, password });
    setIsRequest(false);

    if (response) {
      toast.success('Signup success')
      navigate('/signin');
    }

    if (err) {
      toast.error(err.message)
    }

  }

  return (
    <Box component='form' noValidate onSubmit={form.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          placeholder='username'
          name='username'
          value={form.values.username}
          onChange={form.handleChange}
          error={form.touched.username && form.errors.username != 'underfined'}
          helperText={form.touched.username && form.errors.username}
          sx={TextFieldStyle}
        />
        <TextField
          fullWidth
          type='password'
          placeholder='password'
          name='password'
          value={form.values.password}
          onChange={form.handleChange}
          error={form.touched.password && form.errors.password != 'underfined'}
          helperText={form.touched.password && form.errors.password}
          sx={TextFieldStyle}

        />
        <TextField
          fullWidth
          type='password'
          placeholder='confirm password'
          name='confirmPassword'
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          error={form.touched.confirmPassword && form.errors.confirmPassword != 'underfined'}
          helperText={form.touched.confirmPassword && form.errors.confirmPassword}
          sx={TextFieldStyle}

        />
        <LoadingButton
          type='submit'
          size='large'
          variant='contained'
          loading={isRequest}
          sx={{
            color: 'black', bgcolor: '#a6aaae', border: '1px solid #929497', '&:hover': {
              backgroundColor: '#c7c9cb',
              borderColor: '#929497',
              boxShadow: 'none',
            },
          }}
        >
          signup
        </LoadingButton>
        <Button component={Link} to='/signin' size='small' sx={{ color: '#797a7b', border: '1px solid #adadad', '&:hover': { bgcolor: '#efefef' } }}>
          signin
        </Button>
      </Stack>
    </Box>
  )
}

export default SignUpPage