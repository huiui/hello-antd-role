import request from '@/utils/request';
import { TableListParams, CreateParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryRoles(params?: TableListParams) {
  return request('/admin/roles', {
    params,
  });
}

export async function addRole(params: CreateParams) {
  return request('/admin/roles', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRole(params: FormValueType) {
  return request(`/admin/roles/${params._id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
