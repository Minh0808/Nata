import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api'
import UserForm from '../components/UserForm'
import {
  Table, Th, Td, Tr,
  Background, Menu, Logout, Infor, Title,
  Thead, Tbody, Add, Edit as EditBtn, Delete as DeleteBtn,
  ActionGroup, FilterWrapper, FilterInput,
  Pagination, PageButtons, PageButton, PageSizeSelect,
  PageList,
  ListUser
} from '../style/UserListStyles'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [filterText, setFilterText] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [editing, setEditing] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'normal'
  const isAdmin = role === 'admin'

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear()
        navigate('/login')
      } else {
        toast.error('Không thể tải danh sách người dùng')
      }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    const txt = filterText.trim().toLowerCase()
    return users.filter(u =>
      u.name.toLowerCase().includes(txt) ||
      u.email.toLowerCase().includes(txt)
    )
  }, [users, filterText])

  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered
    return [...filtered].sort((a, b) => {
      const v1 = String(a[sortConfig.key]).toLowerCase()
      const v2 = String(b[sortConfig.key]).toLowerCase()
      if (v1 < v2)  return sortConfig.direction === 'asc' ? -1 : 1
      if (v1 > v2)  return sortConfig.direction === 'asc' ?  1 : -1
      return 0
    })
  }, [filtered, sortConfig])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, currentPage, pageSize])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Đăng xuất thành công!')
    navigate('/login')
  }

  const handleDelete = async id => {
    if (!isAdmin) {
      toast.error('Bạn không đủ quyền xóa user này')
      return
    }
    
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('Xóa thành công!')
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xóa thất bại')
    }
  }

  const openNewForm = () => {
    if (!isAdmin) { toast.error('Không có quyền thêm'); return }
    setEditing({})
  }

  const openEditForm = u => {
    if (!isAdmin) { toast.error('Không có quyền sửa'); return }
    setEditing(u)
  }

  return (
    <Background>
      <Menu><Logout onClick={handleLogout}>Đăng xuất</Logout></Menu>
      <Infor>
        <ListUser>
          <Title>Danh sách người dùng</Title>

            <FilterWrapper>
              <FilterInput
                placeholder="Tìm theo tên hoặc email..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
            </FilterWrapper>

            <Table>
              <Thead>
                <Tr>
                  {[
                    { key: 'user_id', label: 'User_ID' },
                    { key: 'name',    label: 'Name'    },
                    { key: 'email',   label: 'Email'   },
                    { key: 'role',    label: 'Role'    }
                  ].map(col => (
                    <Th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {col.label}
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
                      )}
                    </Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginated.map(u => (
                  <Tr key={u.user_id}>
                    <Td>{u.user_id}</Td>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.role}</Td>
                    <Td>
                      <ActionGroup>
                        <EditBtn onClick={() => openEditForm(u)}>Sửa</EditBtn>
                        <DeleteBtn onClick={() => handleDelete(u.user_id)}>Xóa</DeleteBtn>
                      </ActionGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Pagination>
            <PageButtons>
              <PageButton
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(prev => Math.max(prev - 1, 1))
                }
              >
                ‹ Prev
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <PageButton
                  key={pageNum}
                  disabled={pageNum === currentPage}
                  $active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </PageButton>
              ))}

              <PageButton
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
              >
                Next ›
              </PageButton>
            </PageButtons>
              <PageList>
                Records/page:
                <PageSizeSelect
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[1, 2, 5, 10, 20, 50].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </PageSizeSelect>

              </PageList>
            </Pagination>

            <Add onClick={openNewForm}>Thêm user</Add>
        </ListUser>
        

        {editing && isAdmin && (
          <UserForm
            key={editing.user_id ?? 'new'}
            user={editing}
            onSuccess={() => {
              setEditing(null)
              fetchUsers()
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Infor>
    </Background>
  )
}
