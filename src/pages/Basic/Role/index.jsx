import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deleterole, role, store } from '@/services/basic'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '角色名称',
        name: ['name'],
        required: true,
    },
    description: {
        value: null,
        type: 'textarea',
        title: '备注',
        name: ['description'],
        required: false,
        //serverURL: "https://www.mocky.io/v2/5cc8019d300000980a055e76"//替换为自己的上传地址 富文本图片/附件
        col: { span: 24 },//栅格布局 默认 12
    },
}


function Role(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});

    const actionRef = useRef();
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色类型',
            dataIndex: 'role_type',
            key: 'role_type',
            search: false,
            render: (_, record) => <span>{record.role_type == 0 ? "自定义角色" : "系统角色"}</span>
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <a
                    disabled={record.role_type != 0}
                    style={{color:record.role_type != 0?"#999":"auto"}}
                    onClick={() => {
                        cvs(true);
                        cf(fields => {
                            for (let i in fields) {
                                fields[i].value = record[i];
                            }
                            return { ...fields }
                        });
                        ciftype({
                            val: "edit",
                            title: "编辑角色",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该角色？"}
                    onConfirm={() => {
                        deleterole(record.id).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="删除"
                    onCancel="取消"
                >
                    <a style={{color:"#f50"}}>
                        删除
                    </a>
                </Popconfirm>
                ,

            ],
        },
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
                title: "新增角色"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'basic/addrole',
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
                type: 'basic/editrole',
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
                columns={columns}
                actionRef={actionRef}
                path="/api/role"
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
                        props.loading.effects['basic/addrole'] || !vs
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
}))(Role)