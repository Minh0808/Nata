import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import api from '../services/api'
import { Background, Button, Form, Infor, Input, Option, Select, Title } from '../style/UserFormStyles'

const schema = yup.object({
  user_id: yup.string().required('Bắt buộc'),
  name:    yup.string().required('Bắt buộc'),
  email:   yup.string().email('Sai định dạng').required('Bắt buộc'),
  role:    yup.string().oneOf(['admin','normal']).required('Bắt buộc'),
  isEdit:  yup.boolean().required(),
  password: yup
    .string()
    .when('isEdit', (isEdit, schema) =>
      isEdit
        ? schema.test('len', 'Phải ít nhất 6 ký tự', v => !v || v.length >= 6)
        : schema.required('Bắt buộc').min(6, 'Phải ít nhất 6 ký tự')
    ),
})

export default function UserForm({ user = {}, onSuccess, onCancel }) {
  const isEdit = Boolean(user.user_id)

  const defaultValues = useMemo(() => ({
    user_id:  user.user_id || '',
    name:     user.name    || '',
    email:    user.email   || '',
    role:     user.role    || '',
    password: '',
    isEdit,
  }), [user.user_id, user.name, user.email, user.role, isEdit])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const onSubmit = async (data) => {
    const payload = {
      user_id: data.user_id,
      name:    data.name,
      email:   data.email,
      role:    data.role,
      ...(data.password ? { password: data.password } : {}),
    }

    try {
      if (isEdit) {
        await api.put(`/users/${user.user_id}`, payload)
        toast.success('Cập nhật thành công!')
      } else {
        await api.post('/users', payload)
        toast.success('Tạo mới thành công!')
      }
      onSuccess()
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi không xác định'
      toast.error(msg)
      if (err.response?.status === 400 && msg) {
        if (msg.toLowerCase().includes('user id')) {
          setError('user_id', { type: 'server', message: msg })
        } else if (msg.toLowerCase().includes('email')) {
          setError('email',   { type: 'server', message: msg })
        } else {
          setError('user_id', { type: 'server', message: msg })
        }
      }
    }
  }

  return (
    <Background>
      <Form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Title>{isEdit ? 'Sửa' : 'Thêm'} User</Title>
        <Input type="hidden" {...register('isEdit')} />

        <Infor>
          <Input
            autoComplete="off"
            {...register('user_id')}
            placeholder="User ID"
          />
          {errors.user_id && <p>{errors.user_id.message}</p>}
        </Infor>

        <Infor>
          <Input
            autoComplete="off"
            {...register('name')}
            placeholder="Name"
          />
          {errors.name && <p>{errors.name.message}</p>}
        </Infor>

        <Infor>
          <Input
            autoComplete="off"
            {...register('email')}
            placeholder="Email"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </Infor>

        <Infor>
          <Input
            autoComplete="new-password"
            type="password"
            {...register('password')}
            placeholder={isEdit ? 'Đổi mật khẩu': 'Mật khẩu'}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </Infor>

        <Infor>
          <Select
            autoComplete="off"
            {...register('role')}
          >
            <Option value="">Chọn role</Option>
            <Option value="admin">Admin</Option>
            <Option value="normal">Normal</Option>
          </Select>
          {errors.role && <p>{errors.role.message}</p>}
        </Infor>

        <Infor>
          <Button
            type="submit"
          >
            {isEdit ? 'Lưu' : 'Tạo'}
          </Button>

          <Button
            type="button"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </Infor>
      </Form>
    </Background>
  )
}
