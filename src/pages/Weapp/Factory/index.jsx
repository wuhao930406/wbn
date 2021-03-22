import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd';
import AutoTable from '@/components/AutoTable';
import InitForm from '@/components/InitForm';
import { deletefactory, role, factory } from '@/services/weapp';
import { connect } from 'umi';
import RenderClickImg from '@/components/RenderClickImg'
// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    factory_image: {
        value: null,
        type: 'upload',
        title: '工厂图片',
        name: ['factory_image'],
        required: false,
        col: { span: 24 },//栅格布局 默认 12
        listType: "img",//上传展示类型
        limit: 4, //限制图片上传数量
    },
    name: {
        value: null,
        type: 'input',
        title: '工厂名称',
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
    contact: {
        value: null,
        type: 'input',
        title: '联系方式',
        name: ['contact'],
        required: false,
        col: { span: 24 },//栅格布局 默认 12
    },
    description: {
        value: null,
        type: 'textarea',
        title: '工厂介绍',
        name: ['description'],
        required: false,
        col: { span: 24 },//栅格布局 默认 12
    },
}


function Factory(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '工厂图片',
            dataIndex: 'factory_image',
            key: 'factory_image',
            render: (_, record) => {
                return <div className="center">
                    {
                        record.factory_image.map((it,i) => {
                            return <RenderClickImg key={i} url={it} style={{margin:"0 2px 2px 0"}}></RenderClickImg>   
                        })
                    }
                </div>

            }
        },
        {
            title: '工厂名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            search: false,
        },
        {
            title: '工厂介绍',
            dataIndex: 'description',
            key: 'description',
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
                            title: "编辑工厂",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该工厂？"}
                    onConfirm={() => {
                        deletefactory(record.id).then(res => {
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
                title: "新增工厂"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addfactory',
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
                type: 'weapp/editfactory',
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
                path="/api/factory"
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
                        props.loading.effects['weapp/addfactory'] || !vs
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