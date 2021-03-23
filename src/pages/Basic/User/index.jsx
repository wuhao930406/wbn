import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm, Input, Tag } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { setenable, role, store, getuser, deleteuser,resetuser } from '@/services/basic'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '用户名',
        name: ['name'],
        required: true,
    },
    password: {
        value: null,
        type: 'password',
        title: '密码',
        name: ['password'],
        required: true,
    },
    sex: {
        value: null,
        type: 'radio',
        title: '性别',
        name: ['sex'],
        required: true,
        options: [
            {
                label: "男",
                value: "男"
            },
            {
                label: "女",
                value: "女"
            }
        ],
        col: { span: 24 },//栅格布局 默认 12
    },
    phone: {
        value: null,
        type: 'input',
        title: '手机号',
        name: ['phone'],
        required: false,
    },
    email: {
        value: null,
        type: 'input',
        title: '邮箱',
        name: ['email'],
        required: false,
    },
    enable: {
        value: true,
        type: 'radio',
        title: '是否启用',
        name: ['enable'],
        required: true,
        options: [
            {
                label: "启用",
                value: true
            },
            {
                label: "停用",
                value: false
            }
        ],
        col: { span: 24 },//栅格布局 默认 12
    },
    role_ids: {
        value: [],
        type: 'select',
        title: '绑定角色',
        name: ['role_ids'],
        required: true,
        multiple: true,
        options: {
            database: role,
            params: { is_all: 1 }
        },
        formart: ["id", "name"]
    },
    store_ids: {
        value: [],
        type: 'select',
        title: '绑定门店',
        name: ['store_ids'],
        required: true,
        multiple: true,
        options: {
            database: store,
            params: { is_all: 1 }
        },
        formart: ["id", "name"]
    },
    // description: {
    //     value: null,
    //     type: 'textarea',
    //     title: '备注',
    //     name: ['description'],
    //     required: false,
    //     //serverURL: "https://www.mocky.io/v2/5cc8019d300000980a055e76"//替换为自己的上传地址 富文本图片/附件
    //     col: { span: 24 },//栅格布局 默认 12
    // },
}


function User(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});

    const actionRef = useRef();
    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            search: false
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            search: false
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            search: false
        },
        {
            title: '是否启用',
            dataIndex: 'enable',
            key: 'enable',
            search: false,
            render: (_, record) => {
                return <Switch checkedChildren="启用" unCheckedChildren="停用" checked={record.enable} onChange={() => {
                    setenable({ id: record.id, enable: !record.enable }).then(res => {
                        res.code == 0 && actionRef.current.reload();
                    })
                }}></Switch>
            }
        },
        {
            title: '是否是管理员',
            dataIndex: 'is_admin',
            key: 'is_admin',
            search: false,
            render: (_, record) => {
                return record.is_admin ? "是" : "否"
            }
        },
        {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            search: false,
            render: (_, record) => {
                return Array.isArray(record.roles) ? record.roles.map((it, i) => <Tag key={i} style={{ float: "left" }}>{it.role_name}</Tag>) : "-"
            }
        },
        {
            title: '门店',
            dataIndex: 'stores',
            key: 'stores',
            search: false,
            render: (_, record) => {
                return Array.isArray(record.stores) ? record.stores.map((it, i) => <Tag color="lightblue" key={i}>{it.store_name}</Tag>) : "-"
            }
        },
        {
            title: '操作',
            valueType: 'option',
            width:160,
            fixed:"right",
            render: (text, record, _, action) => [
                <a
                    onClick={() => {
                        cf(fields => {
                            for (let i in fields) {
                                fields[i].value = record[i];
                                if (i == "password") {
                                    fields[i].hides = true;
                                }
                                if (i == "store_ids") {
                                    fields[i].value = record.stores.map((it) => it.store_id);
                                } else if (i == "role_ids") {
                                    fields[i].value = record.roles.map((it) => it.role_id);
                                }
                            }
                            return { ...fields }
                        });
                        cvs(true);
                        ciftype({
                            val: "edit",
                            title: "编辑用户",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该用户？"}
                    onConfirm={() => {
                        deleteuser(record.id).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="删除"
                    onCancel="取消"
                >
                    <a style={{ color: "#f50" }}>
                        删除
                    </a>
                </Popconfirm>
                ,
                <Popconfirm
                    placement="bottom"
                    title={"确认重置该用户密码？"}
                    onConfirm={() => {
                        resetuser({id:record.id}).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="确定"
                    onCancel="取消"
                >
                    <a style={{ color: "#f50" }}>
                        重置密码
                    </a>
                </Popconfirm>
            ],
        },
    ]

    let extrarender = (<div>
        <Button size={"middle"} type="primary" onClick={() => {
            cvs(true);
            cf(fields => {
                for (let i in fields) {
                    fields[i].value = '';
                    if (i == "enable") {
                        fields[i].value = true;
                    }
                    if (i == "store_ids" || i == "role_ids") {
                        fields[i].value = [];
                    }
                }
                return { ...fields }
            });
            ciftype({
                val: "add",
                title: "新增人员"
            })
        }}>新增</Button>
    </div>)

    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'basic/adduser',
                payload: values
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        } else if (iftype.val == "edit") {
            dispatch({
                type: 'basic/edituser',
                payload: { ...values, id: iftype.id }
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        }
    }

    return (
        <Card title={props.route.name} extra={extrarender}>
            <AutoTable
                x={990}
                columns={columns}
                actionRef={actionRef}
                path="/api/user"
            ></AutoTable>
            <Modal
                maskClosable={false}
                title={iftype.title}
                visible={vs}
                onCancel={() => cvs(false)}
                footer={false}
                width={1000}
                style={{ top: 20 }}
                destroyOnClose={true}
            >
                <InitForm
                    fields={fields}
                    submitData={(values, fn) => {
                        saveData(values, fn)
                    }}
                    onChange={(changedValues, allValues) => {
                        //联动操作
                    }}
                    submitting={
                        props.loading.effects['basic/adduser'] || !vs
                    }
                >
                </InitForm>


            </Modal>

        </Card>
    )
}

export default connect(({ basic, loading }) => ({
    basic,
    loading,
}))(User)