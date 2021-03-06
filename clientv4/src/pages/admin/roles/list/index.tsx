import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, CreateParams, PermissionFormParams } from './data.d';
import { queryRoles, updateRole, addRole, setPermissions } from './service';
import moment from 'moment';
import PermissionForm from './components/PermissionForm';
import { TableListItem as PermissionData } from '../../permissions/list/data.d';
import checkPermission from '@/utils/checkPermission';

/**
 * 添加角色
 * @param fields
 */
const handleAdd = async (fields: CreateParams) => {
  const hide = message.loading('正在添加');
  try {
    await addRole({
      name: fields.name,
      nameCn: fields.nameCn,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新角色
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateRole({
      _id: fields._id,
      name: fields.name,
      nameCn: fields.nameCn,
    });
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 * 分配权限
 * @param fields
 */
const handlePermissions = async (fields: PermissionFormParams) => {
  const hide = message.loading('正在修改');
  try {
    await setPermissions({
      _id: fields._id,
      permissionIds: fields.permissionIds,
    });
    hide();

    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [permissionModalVisible, handlePermissionModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [permissionFormValues, setPermissionFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'name',
    },
    {
      title: '名称',
      dataIndex: 'nameCn',
    },
    {
      title: '权限列表',
      dataIndex: 'permissions',
      renderText: (permissions: PermissionData[]) =>
        permissions.map(permission => permission.nameCn).join(', '),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      renderText: (val: string) => moment(val).fromNow(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {checkPermission('update role') ? (
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              修改
            </a>
          ) : null}

          {checkPermission('allocate permissions for role') ? (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  handlePermissionModalVisible(true);
                  setPermissionFormValues(record);
                }}
              >
                分配权限
              </a>
            </>
          ) : null}
        </>
      ),
    },
  ];

  const renderCreateButton = () => {
    if (checkPermission('create role')) {
      return (
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [renderCreateButton()]}
        pagination={false}
        search={false}
        request={params => queryRoles()}
        columns={columns}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      {permissionFormValues && Object.keys(permissionFormValues).length ? (
        <PermissionForm
          onSubmit={async value => {
            const success = await handlePermissions(value);
            if (success) {
              handlePermissionModalVisible(false);
              setPermissionFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handlePermissionModalVisible(false);
            setPermissionFormValues({});
          }}
          updateModalVisible={permissionModalVisible}
          values={permissionFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
