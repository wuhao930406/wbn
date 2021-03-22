import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletebanner, joblist } from '@/services/weapp'
import RenderClickImg from '@/components/RenderClickImg'
import { connect } from 'umi'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    banner_image: {
        value: null,
        type: 'upload',
        title: '图片',
        name: ['banner_image'],
        required: true,
        col: { span: 24 },//栅格布局 默认 12
        listType: "img",//上传展示类型
        limit: 1, //限制图片上传数量
    },
    weight: {
        value: null,
        type: 'inputnumber',
        title: '排名',
        name: ['weight'],
        required: true,
        col: { span: 24 },//栅格布局 默认 12
    },
    location_type: {//joblist
        value: null,
        type: 'select',
        title: '发布类型',
        name: ['location_type'],
        required: true,
        options: [
            {
                label: "图片",
                value: 0
            },
            {
                label: "广告",
                value: 1
            },
            {
                label: "岗位",
                value: 2
            },
        ],
        linked: true,
        col: { span: 24 },//栅格布局 默认 12
    },
    url: {
        value: null,
        type: 'input',
        title: '跳转地址',
        name: ['url'],
        required: true,
        belinked: {
            hides: [ //可以多个条件并存 数组内添加即可
                {
                    name: "location_type", //联动的是哪个formitem
                    unequalvalue: [1], //这个formitem值为多少 hide
                    //unequalvalue:"",//这个formitem值不是多少 hide  equalvalue与unequalvalue只存在1个
                    required: true
                }
            ],
        },
        col: { span: 24 },//栅格布局 默认 12
    },
    query: {//joblist
        value: null,
        type: 'select',
        title: '选择岗位',
        name: ['query'],
        required: true,
        options: {
            database: joblist,
            params: { is_all: 1 }
        },
        belinked: {
            hides: [ //可以多个条件并存 数组内添加即可
                {
                    name: "location_type", //联动的是哪个formitem
                    unequalvalue: 2, //这个formitem值为多少 hide
                    //unequalvalue:"",//这个formitem值不是多少 hide  equalvalue与unequalvalue只存在1个
                    required: true
                }
            ],
        },
        col: { span: 24 },//栅格布局 默认 12
    },


}


function Banner(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '图片',
            dataIndex: 'preview_url',
            key: 'preview_url',
            search: false,
            render: (_, record) => {
                return <div className="center">
                    <RenderClickImg url={{
                        preview_url: record.preview_url,
                        origin_url: record.origin_url,
                    }} style={{ margin: "0 2px 2px 0" }}></RenderClickImg>
                </div>
            }
        },
        {
            title: '排名',
            dataIndex: 'weight',
            key: 'weight',
            search: false,
        },
        {
            title: '跳转地址',
            dataIndex: 'url',
            key: 'url',
            search: false,
        },
        {
            title: '类型',
            dataIndex: 'location_type',
            key: 'location_type',
            render(_, record) {
                return record.location_type == 0 ? "图片" : record.location_type == 1 ? "广告" : "岗位"
            }
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
                                if (i == "banner_image") {
                                    fields[i].value = {
                                        preview_url: record.preview_url,
                                        origin_url: record.origin_url,
                                    };
                                }
                                if (i == "query") {
                                    fields[i].value = parseInt(record[i]) 
                                }
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
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该轮播图？"}
                    onConfirm={() => {
                        deletebanner(record.id).then(res => {
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
                title: "新增关键词"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        if (values.location_type == 2) {
            values.url = "/detail";
        }
        let post = {
            ...values.banner_image,
            ...values
        }
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addbanner',
                payload: post
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        } else if (iftype.val == "edit") {
            dispatch({
                type: 'weapp/editbanner',
                payload: { ...post, id: iftype.id }
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
                path="/api/banner"
                pagination="false"
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
                        props.loading.effects['weapp/addbanner'] || !vs
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
}))(Banner)