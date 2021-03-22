import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletecustomer, role, customer } from '@/services/weapp'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '昵称',
        name: ['name'],
        required: true,
        col: { span: 24 },//栅格布局 默认 12
    },
    tel: {
        value: null,
        type: 'input',
        title: '电话',
        name: ['tel'],
        required: true,
        col: { span: 24 },//栅格布局 默认 12
    },
}


function Customer(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '昵称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '电话',
            dataIndex: 'tel',
            key: 'tel',
            search: false,
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <a
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
                            title: "编辑客服",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该客服？"}
                    onConfirm={() => {
                        deletecustomer(record.id).then(res => {
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
                title: "新增客服"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addcustomer',
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
                type: 'weapp/editcustomer',
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
                path="/api/customer"
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
                        props.loading.effects['weapp/addcustomer'] || !vs
                    }
                >
                </InitForm>


            </Modal>

        </Card>
    )
}

export default connect(({ weapp, loading }) => ({
    weapp,
    loading,
}))(Customer)