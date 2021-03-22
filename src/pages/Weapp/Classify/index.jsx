import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletemax_classify, deletemin_classify } from '@/services/weapp'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '分类名称',
        name: ['name'],
        required: true,
        col:{span:24}
    }
}

function Factory(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                !record.max_classify_id?
                <a
                    onClick={() => {
                        cvs(true);
                        cf(fields => {
                            for (let i in fields) {
                                fields[i].value = null;
                            }
                            return { ...fields }
                        });
                        ciftype({
                            val: "addchild",
                            title: `新增${record.name}下的小类`,
                            id: record.id,
                            cur:record
                        })
                    }}
                >
                    新增小类
                </a>:null,
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
                            val: record.max_classify_id?"editchild":"edit",
                            title: "编辑分类",
                            id: record.id,
                            cur:record
                        })
                    }}
                >
                    编辑
                </a>,
                !record.min_classifies||record.min_classifies.length==0 ?
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该分类？"}
                    onConfirm={() => {
                        let deletefn = record.max_classify_id?deletemin_classify:deletemax_classify;
                        deletefn(record.id).then(res => {
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
                </Popconfirm>:null
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
                title: "新增分类"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addmax_classify',
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
                type: 'weapp/editmax_classify',
                payload: { ...values, id: iftype.id }
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        } else if (iftype.val == "addchild") {
            dispatch({
                type: 'weapp/addmin_classify',
                payload: { ...values, max_classify_id: iftype.id }
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        } else if (iftype.val == "editchild") {
            dispatch({
                type: 'weapp/editmin_classify',
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
                path="/api/max_classify"
                expandable={{
                    childrenColumnName:"min_classifies"
                }}
            ></AutoTable>

            <Modal
                maskClosable={false}
                title={iftype.title}
                visible={vs}
                onCancel={() => cvs(false)}
                footer={false}
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
                        props.loading.effects['weapp/addmax_classify'] || !vs
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
}))(Factory)