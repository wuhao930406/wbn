import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { enrollquit, enrollset_working, getjob, getfactory } from '@/services/weapp'
import { connect } from 'umi'
import moment from 'moment'
import RenderDetail from '@/components/RenderDetail';
import RenderClickImg from '@/components/RenderClickImg'


// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let defaultFields = {
    status: {
        value: null,
        type: 'select',
        title: '关键词名称',
        name: ['status'],
        required: true,
        col: { span: 24 },
        options: [
            { label: "不通过", value: false },
            { label: "通过", value: true }
        ]
    },
}


function Enroll(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState(defaultFields),
        [iftype, ciftype] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: '报名人',
            dataIndex: 'member_name',
            key: 'member_name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '岗位',
            dataIndex: 'job',
            key: 'job',
            search: false,
            render: (_, record) => {
                return <a className="oneline" onClick={() => {
                    getjob(record.job_id).then(res => {
                        let data = res.data;
                        Modal.info({
                            title: "岗位信息",
                            width: 1000,
                            style: { top: 20 },
                            content: <RenderDetail style={{ paddingTop: 8 }} formart={[
                                { "岗位名称": data?.name },
                                { "工厂名称": data?.factory?.name },
                                { "工厂地址": data?.factory?.address },
                                { "工厂联系方式": data?.factory?.contact },
                                { "月薪": data?.min_month_salary + " - " + data?.max_month_salary + "元" },
                                { "时薪": data?.hour_salary + "元" },
                                { "补贴": data?.subsidy },
                                { "分类": data?.max_classify_name + (data?.min_classify_name ? " / " + data?.min_classify_name : " ") },
                                { "关键词": <span className="centers">{data?.keywords.map(it => { return <b style={{ fontWeight: "normal", marginRight: 8 }}>{it.keyword_name}</b> })} </span> },
                                { "发布状态": data?.status == "open" ? "发布" : "下架" },
                                { "福利": data?.welfare },
                                { "招聘条件": data?.condition },
                                { "岗位介绍": data?.job_description },
                            ]} />
                        })
                    })
                }}>{record.job?.name}</a>
            }
        },
        {
            title: '报名的工厂',
            dataIndex: 'factory_name',
            key: 'factory_name',
            search: false,
            render: (_, record) => {
                return <a className="oneline" onClick={() => {
                    getfactory(record.factory_id).then(res => {
                        let data = res.data;
                        Modal.info({
                            title: "工厂信息",
                            width: 1000,
                            style: { top: 20 },
                            content: <RenderDetail style={{ paddingTop: 8 }} formart={[
                                {
                                    "工厂图片": <div style={{display:"flex",paddingTop:12}}>
                                        {
                                            data?.factory_image.map((it, i) => {
                                                return <RenderClickImg size={36} key={i} url={it} style={{ margin: "0 2px 2px 0" }}></RenderClickImg>
                                            })
                                        }
                                    </div>
                                },
                                { "工厂名称": data?.name },
                                { "工厂地址": data?.address },
                                { "工厂联系方式": data?.contact },
                                { "工厂介绍": data?.description },
                            ]} />
                        })
                    })



                }}>{record.factory_name}</a>
            }
        },
        {
            title: '报名状态',
            dataIndex: 'status_name',
            key: 'status_name',
            search: false
        },
        {
            title: '报名审核通过时间',
            dataIndex: 'approved_time',
            key: 'approved_time',
            search: false,
            render: (_, record) => record.approved_time ? moment(record.approved_time).format("YYYY-MM-DD HH:mm:ss") : "_"
        },
        {
            title: '报名审核不通过时间',
            dataIndex: 'refused_time',
            key: 'refused_time',
            search: false,
            render: (_, record) => record.refused_time ? moment(record.refused_time).format("YYYY-MM-DD HH:mm:ss") : "_"

        },
        {
            title: '离职时间',
            dataIndex: 'quit_time',
            key: 'quit_time',
            search: false,
            render: (_, record) => record.quit_time ? moment(record.quit_time).format("YYYY-MM-DD HH:mm:ss") : "_"
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <a
                    disabled={record.status !== "pending"}
                    onClick={() => {
                        cvs(true);
                        cf(fields => {
                            for (let i in fields) {
                                fields[i].value = null;
                            }
                            return { ...fields }
                        });
                        ciftype({
                            val: "verify",
                            title: "审核",
                            id: record.id
                        })
                    }}
                >
                    审核
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认给他办理入职手续？"}
                    onConfirm={() => {
                        enrollset_working({ id: record.id }).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="入职"
                    onCancel="取消">
                    <a disabled={record.status !== "to_be_employed"}>
                        入职
                    </a>
                </Popconfirm>
                ,
                <Popconfirm
                    placement="bottom"
                    title={"确认把他办理离职手续？"}
                    onConfirm={() => {
                        enrollquit({ id: record.id }).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="离职"
                    onCancel="取消">
                    <a disabled={record.status !== "working"}>
                        离职
                    </a>
                </Popconfirm>
            ],
        },
    ]



    let saveData = (values) => {
        let { dispatch } = props;
        if (iftype.val == "verify") {
            dispatch({
                type: 'weapp/enrollverify',
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
        <Card title={props.route.name}>
            <AutoTable
                columns={columns}
                actionRef={actionRef}
                path="/api/enroll"
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
                        props.loading.effects['weapp/enrollverify'] || !vs
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
}))(Enroll)