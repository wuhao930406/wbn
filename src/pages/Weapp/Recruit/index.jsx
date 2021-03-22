import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm, Tag } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletejob, getclassify, getkeyword, factory } from '@/services/weapp'
import { connect } from 'umi'
import RenderDetail from '@/components/RenderDetail';

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 



function Recruit(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState({
            name: {
                value: null,
                type: 'input',
                title: '招聘标题',
                name: ['name'],
                required: true,
            },
            factory_id: {
                value: null,
                type: 'select',
                title: '选择需要招聘的工厂',
                name: ['factory_id'],
                required: true,
                options: {
                    database: factory,
                    params: { is_all: 1 }
                }
            },
            min_month_salary: {
                value: null,
                type: 'inputnumber',
                title: '最低月薪(元)',
                name: ['min_month_salary'],
                required: true,
            },
            max_month_salary: {
                value: null,
                type: 'inputnumber',
                title: '最高月薪(元)',
                name: ['max_month_salary'],
                required: true,
            },
            hour_salary: {
                value: null,
                type: 'inputnumber',
                title: '时薪 (小时/元)',
                name: ['hour_salary'],
                required: true,
            },
            classify: {
                value: null,
                type: 'cascader',
                title: '选择分类',//{ label: 'name', value: 'code', children: 'items' }
                name: ['classify'],
                required: true,
                fieldNames: {
                    label: "name",
                    value: "id",
                    children: "min_classifies"
                },
                options: {
                    database: getclassify,
                    params: { is_all: 1 }
                }
            },
            keyword_ids: {
                value: null,
                type: 'select',
                title: '关键词',
                name: ['keyword_ids'],
                required: false,
                multiple: true,
                options: {
                    database: getkeyword,
                    params: { is_all: 1 }
                }
            },
            subsidy: {
                value: null,
                type: 'input',
                title: '补贴',
                name: ['subsidy'],
                required: false,
            },
            status: {
                value: "close",
                type: 'select',
                title: '发布状态',
                name: ['status'],
                required: true,
                options: [
                    {
                        label: "发布",
                        value: "open"
                    },
                    {
                        label: "下架",
                        value: "close"
                    }
                ]
            },
            welfare: {
                value: null,
                type: 'textarea',
                title: '薪资福利',
                name: ['welfare'],
                required: false,
                col: { span: 24 },//栅格布局 默认 12
            },
            condition: {
                value: null,
                type: 'textarea',
                title: '招聘条件',
                name: ['condition'],
                required: false,
                col: { span: 24 },//栅格布局 默认 12
            },
            job_description: {
                value: null,
                type: 'textarea',
                title: '岗位介绍',
                name: ['job_description'],
                required: false,
                col: { span: 24 },//栅格布局 默认 12
            },

        }),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '工厂信息',
            search: false,
            children: [
                {
                    title: '工厂名称',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true,
                    render: (_, record) => {
                        return <span>{record.factory?.name}</span>
                    }
                },
                {
                    title: '联系方式',
                    dataIndex: 'contact',
                    key: 'contact',
                    render: (_, record) => {
                        return <span>{record.factory?.contact}</span>
                    }
                },
            ]
        },
        {
            title: '岗位名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '月薪范围(元)',
            dataIndex: 'range',
            key: 'range',
            search: false,
            render: (_, record) => {
                return <span>{record.min_month_salary + " - " + record.max_month_salary} </span>
            }
        },
        {
            title: '时薪 (小时/元)',
            dataIndex: 'hour_salary',
            key: 'hour_salary',
            search: false,
        },
        {
            title: '补贴',
            dataIndex: 'subsidy',
            key: 'subsidy',
            search: false,
        },
        {
            title: '发布状态',
            dataIndex: 'status',
            key: 'status',
            search: false,
            render: (_, record) => <span>{record.status == "open" ? "发布" : "下架"}</span>
        },
        // {
        //     title: '子分类',
        //     dataIndex: 'min_classify_name',
        //     key: 'min_classify_name',
        //     search: false,
        // },
        // {
        //     title: '关键词',
        //     dataIndex: 'keywords',
        //     key: 'keywords',
        //     search: false,
        //     render: (_, record) => {
        //         return <span>{record.keywords.map(it => {
        //             return <Tag>{it.keyword_name}</Tag>
        //         })} </span>
        //     }
        // },
        {
            title: '操作',
            valueType: 'option',
            width:170,
            render: (text, record, _, action) => [
                <a onClick={() => {
                    Modal.info({
                        title: "岗位信息",
                        width:1000,
                        style:{top:20},
                        content: <RenderDetail style={{paddingTop:8}} formart={[
                            { "岗位名称": record.name },
                            { "工厂名称": record.factory?.name },
                            { "工厂地址": record.factory?.address },
                            { "工厂联系方式": record.factory?.contact },
                            { "月薪": record.min_month_salary + " - " + record.max_month_salary + "元" },
                            { "时薪": record.hour_salary + "元" },
                            { "补贴": record.subsidy },
                            { "分类": record.max_classify_name + (record.min_classify_name ? " / " + record.min_classify_name : " ") },
                            { "关键词": <span className="centers">{record.keywords.map(it => { return <b style={{fontWeight:"normal",marginRight:8}}>{it.keyword_name}</b> })} </span> },
                            { "发布状态": record.status == "open" ? "发布" : "下架" },
                            { "福利": record.welfare },
                            { "招聘条件": record.condition },
                            { "岗位介绍": record.job_description },
                        ]} />
                    })
                }}>
                    查看详情
                </a>,
                <a
                    onClick={() => {
                        cvs(true);
                        cf(fields => {
                            for (let i in fields) {
                                fields[i].value = record[i];
                                if (i == "classify") {
                                    fields[i].value = [record.max_classify_id, record.min_classify_id]
                                }
                                if (i == "keyword_ids") {
                                    fields[i].value = record.keywords && record.keywords.map((it) => it.keyword_id);
                                }
                            }
                            return { ...fields }
                        });
                        ciftype({
                            val: "edit",
                            title: "编辑岗位",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该岗位？"}
                    onConfirm={() => {
                        deletejob(record.id).then(res => {
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
                    if (i == "status") {
                        fields[i].value = "close";
                    }
                    if (i == "keyword_ids") {
                        fields[i].value = [];
                    }
                }
                return { ...fields }
            });
            ciftype({
                val: "add",
                title: "新增岗位"
            })
        }}>新增</Button>
    </div>)


    let saveData = (values) => {
        let { dispatch } = props;
        let postdata = {
            ...values,
            max_classify_id: values.classify[0],
            min_classify_id: values.classify[1]
        }
        delete postdata?.classify;
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addjob',
                payload: postdata
            }).then(res => {
                if (res.code == 0) {
                    message.success("操作成功");
                    actionRef.current.reload();
                    cvs(false)
                }
            })
        } else if (iftype.val == "edit") {
            dispatch({
                type: 'weapp/editjob',
                payload: { ...postdata, id: iftype.id }
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
                path="/api/job"
                bordered={true}
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
                        props.loading.effects['weapp/addjob'] || !vs
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
}))(Recruit)