import React, { useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card, Drawer, Button, Modal, message, Popconfirm, Tag } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletetrain, role, train, stations } from '@/services/weapp'
import { connect, history } from 'umi'
import moment from 'moment';
import Trainrecord from '../Trainrecord'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 



function Train(props) {
    const { weapp: { stations }, dispatch } = props;
    const [vs, cvs] = useState(false),//表单显/隐
        [fields, cf] = useState({
            name: {
                value: null,
                type: 'input',
                title: '班车简称',
                name: ['name'],
                required: true,
                col: { span: 24 },//栅格布局 默认 12
            },
            start_station: {
                value: undefined,
                type: 'autoinput',
                title: '出发地',
                name: ['start_station'],
                required: true,
                col: { span: 24 },//栅格布局 默认 12
                options: stations
            },
            end_station: {
                value: undefined,
                type: 'autoinput',
                title: '目的地',
                name: ['end_station'],
                required: true,
                col: { span: 24 },//栅格布局 默认 12
                options: stations
            },
            start_time: {
                value: null,
                type: 'datepicker',
                title: '出发时间',
                name: ['start_time'],
                format: "YYYY-MM-DD HH:mm:ss",
                showTime: true,
                required: true,
                disabledDate:(current)=>{
                    return current && current < moment().add('day',-1).endOf('day');
                },
                col: { span: 24 },//栅格布局 默认 12
            },
            start_place: {
                value: null,
                type: 'input',
                title: '出发地址',
                name: ['start_place'],
                required: true,
                col: { span: 24 },//栅格布局 默认 12
            },
            max_people: {
                value: null,
                type: 'inputnumber',
                title: '核载人数',
                name: ['max_people'],
                required: true,
                min: 0,
                col: { span: 24 },//栅格布局 默认 12
            },
        }),
        [visible, setVisible] = useState(false),
        [iftype, ciftype] = useState({});


    const actionRef = useRef();
    const columns = [
        {
            title: '班车简称',
            dataIndex: 'name',
            key: 'name',
            search: false,
        },
        {
            title: '出发地',
            dataIndex: 'start_station',
            key: 'start_station',
            valueType: "select",
            request: async () => {
                return stations
            }
        },
        {
            title: '目的地',
            dataIndex: 'end_station',
            key: 'end_station',
            valueType: "select",
            request: async () => {
                return stations
            }
        },
        {
            title: '出发时间',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (_, record) => record.start_time ? moment(record.start_time).format("YYYY-MM-DD HH:mm:ss") : "_",
            valueType:"dateRange",

        },
        {
            title: '出发地点',
            dataIndex: 'start_place',
            key: 'start_place',
            search: false,
        },
        {
            title: '核载人数',
            dataIndex: 'max_people',
            key: 'max_people',
            search: false,
        },
        {
            title: '已有人数',
            dataIndex: 'num',
            key: 'num',
            search: false,
            render(_, record) {
                return <a onClick={() => {
                    setVisible(true);
                    ciftype({
                        ...iftype,
                        id: record.id,

                    })
                }}>{record.num}</a>
            }
        },
        {
            title: '状态',
            dataIndex: 'is_expire',
            key: 'is_expire',
            search: false,
            render: (_, record) => {
                return <Tag color={record.is_expire ? "grey" : "green"}>{record.is_expire ? "已发车" : "未发车"}</Tag>
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
                            }
                            return { ...fields }
                        });
                        ciftype({
                            val: "edit",
                            title: "编辑车次",
                            id: record.id
                        })
                    }}
                >
                    编辑
                </a>,
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该车次？"}
                    onConfirm={() => {
                        deletetrain(record.id).then(res => {
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

    useMemo(() => {
        dispatch({
            type: 'weapp/stations',
        })
    }, [vs])


    let extrarender = (<div>
        <Button size={"middle"} type="primary" onClick={() => {
            cvs(true);
            cf(fields => {
                for (let i in fields) {
                    fields[i].value = undefined;
                    if (i == "end_station" || i == "start_station") {
                        fields[i].options = props.weapp.stations;
                    }
                }
                return { ...fields }
            });
            ciftype({
                val: "add",
                title: "新增车次"
            })
        }}>新增</Button>
    </div>)






    let saveData = (values) => {
        if (iftype.val == "add") {
            dispatch({
                type: 'weapp/addtrain',
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
                type: 'weapp/edittrain',
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
                path="/api/train"
            ></AutoTable>
            <Drawer
                title="预览"
                placement="top"
                closable={true}
                onClose={() => { setVisible(false) }}
                visible={visible}
                height="100%"
            >
                <div style={{ marginTop: -8 }}>
                    <Trainrecord {...props} id={iftype.id}></Trainrecord>
                </div>
            </Drawer>


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
                        props.loading.effects['weapp/edittrain'] || props.loading.effects['weapp/addtrain'] || !vs
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
}))(Train)