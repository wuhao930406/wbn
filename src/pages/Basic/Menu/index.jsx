import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletestore, role, store } from '@/services/basic'
import { connect, Link } from 'umi'
import { Icon } from '@ant-design/compatible';

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '门店名称',
        name: ['name'],
        required: true,
    },
    address: {
        value: null,
        type: 'textarea',
        title: '地址',
        name: ['address'],
        required: false,
        col: { span: 24 },//栅格布局 默认 12
    },
}


function Menu(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
            render:(dom,record)=>{
                return record.routes?<span>{record.name}</span>:<Link to={record.path}>{record.name}</Link>
            }
        },
        {
            title: '菜单图标',
            dataIndex: 'icon',
            key: 'icon',
            search: false,
            render:(dom,record)=>{
                return <Icon type={record.icon}></Icon>
            }
        },
        // {
        //     title: '操作',
        //     valueType: 'option',
        //     render: (text, record, _, action) => [
        //         <a
        //             onClick={() => {
        //                 cvs(true);
        //                 cf(fields => {
        //                     for (let i in fields) {
        //                         fields[i].value = record[i];
        //                     }
        //                     return { ...fields }
        //                 });
        //                 ciftype({
        //                     val: "edit",
        //                     title: "编辑门店",
        //                     id: record.id
        //                 })
        //             }}
        //         >
        //             编辑
        //         </a>,
        //         <Popconfirm
        //             placement="bottom"
        //             title={"确认删除该门店？"}
        //             onConfirm={() => {
        //                 deletestore(record.id).then(res => {
        //                     if (res.code == 0) {
        //                         message.success("操作成功");
        //                         actionRef.current.reload();
        //                     }
        //                 })
        //             }}
        //             okText="删除"
        //             onCancel="取消"
        //         >
        //             <a>
        //                 删除
        //             </a>
        //         </Popconfirm>
        //         ,

        //     ],
        // },
    ]

    let extrarender = (<div>
        <Button size={"middle"} type="primary" onClick={() => {
            cvs(true);
            cf(fields => {
                for (let i in fields) {
                    fields[i].value = null;
                }
                return { ...fields }
            });
            ciftype({
                val: "add",
                title: "新增门店"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'basic/addstore',
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
                type: 'basic/editstore',
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
        <Card title={props.route.name} extra={/*extrarender*/null}>
            <AutoTable
                columns={columns}
                actionRef={actionRef}
                expandable={{
                    childrenColumnName:"routes"
                }}
                rowKey="path"
                dataSource={[ 
                  {
                    path: '/welcome',
                    name: '欢迎',
                    icon: 'smile',
                    component: './Welcome',
                  },
                  {
                    path: '/basic',
                    name: '系统基础管理',
                    icon: 'setting',
                    routes: [
                      {
                        path: '/basic/user',
                        name: '用户管理',
                        component: './Basic/User',
                      },
                      {
                        path: '/basic/role',
                        name: '角色管理',
                        component: './Basic/Role',
                      },
                      {
                        path: '/basic/menu',
                        name: '菜单权限',
                        component: './Basic/Menu',
                      },
                    ],
                  },
                  {
                    path: '/weapp',
                    name: '公众号信息管理',
                    icon: 'wechat',
                    routes: [
                      {
                        path: '/weapp/store',
                        name: '门店管理',
                        component: './Weapp/Store',
                      },
                      {
                        path: '/weapp/factory',
                        name: '工厂管理',
                        component: './Weapp/Factory',
                      },
                    ],
                  }]}
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
                    submitData={(values) => {
                        saveData(values)
                    }}
                    onChange={(changedValues, allValues) => {
                        //联动操作
                    }}
                    submitting={
                        props.loading.effects['basic/addstore'] || !vs
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
}))(Menu)