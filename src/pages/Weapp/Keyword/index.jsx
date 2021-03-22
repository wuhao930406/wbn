import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletekeyword, role, keyword } from '@/services/weapp'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    name: {
        value: null,
        type: 'input',
        title: '关键词名称',
        name: ['name'],
        required: true,
        col:{span:24}
    },
}


function Keyword(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '关键词名称',
            dataIndex: 'name',
            key: 'name',
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
                            title: "编辑关键词",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>
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
                title: "新增关键词"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addkeyword',
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
                type: 'weapp/editkeyword',
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
                path="/api/keyword"
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
                        props.loading.effects['weapp/addkeyword'] || !vs
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
}))(Keyword)