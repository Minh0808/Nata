import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Background,
  Title,
  FormLogin,
  PassWord,
  ID,
  InputID,
  InputPassWord,
  ButtonLogin
} from '../style/LoginStyles';

const schema = yup.object({
  email:    yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  password: yup.string().required('Bắt buộc'),
});

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    reset({ email: '', password: '' });
    localStorage.removeItem('role');
  }, [reset]);

  const onSubmit = async data => {
    try {
      const res = await api.post('/users/login', data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      toast.success('Đăng nhập thành công!');
      navigate('/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <Background>
      <Title>Đăng nhập</Title>
      <FormLogin onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <ID>
          <InputID
            type="email"
            {...register('email')}
            placeholder="Email"
            autoComplete="username"
          />
          <p>{errors.email?.message}</p>
        </ID>

        <PassWord className="mb-6">
          <InputPassWord
            type="password"
            {...register('password')}
            placeholder="Mật khẩu"
            autoComplete="new-password"
            name="password"
          />
          <p>{errors.password?.message}</p>
        </PassWord>

        <ButtonLogin type="submit">
          Đăng nhập
        </ButtonLogin>
      </FormLogin>
    </Background>
  );
}
