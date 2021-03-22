import React, { useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card, Switch, Button, Modal, message, Popconfirm, Tag } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { deletetrainrecord, } from '@/services/weapp'
import { connect } from 'umi'
import moment from 'moment';


// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 



function Trainrecord(props) {
    const actionRef = useRef();
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            search: false,
        },
        {
            title: '乘车状态',
            dataIndex: 'status',
            key: 'status',
            search: false,
            render(_, record) {
                return <Tag color={record.status !== 'waiting' ? "grey" : "green"}>{record.status !== 'waiting' ? "已发车" : "未发车"}</Tag>
            }
        },
        {
            title: '出发时间',
            dataIndex: 'start_time',
            key: 'start_time',
            search: false,
            render: (_, record) => record.train.start_time ? moment(record.train.start_time).format("YYYY-MM-DD HH:mm") : "_"
        },
        {
            title: '出发地点',
            dataIndex: 'start_place',
            key: 'start_place',
            search: false,
            render: (_, record) => record.train.start_place
        },
        {
            title: '核载人数',
            dataIndex: 'max_people',
            key: 'max_people',
            search: false,
            render: (_, record) => record.train.max_people
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record, _, action) => [
                <Popconfirm
                    placement="bottom"
                    title={"确认删除该车次？"}
                    onConfirm={() => {
                        deletetrainrecord(record.id).then(res => {
                            if (res.code == 0) {
                                message.success("操作成功");
                                actionRef.current.reload();
                            }
                        })
                    }}
                    okText="删除"
                    onCancel="取消"
                >
                    <a disabled={record.status !== 'waiting'} style={{ color: record.status !== 'waiting' ? "#999" : "#f50" }}>
                        删除
                    </a>
                </Popconfirm>
                ,

            ],
        },
    ]

    return (
        <AutoTable
            columns={columns}
            actionRef={actionRef}
            extraparams={{train_id:props.id}}
            path="/api/train_record"
        ></AutoTable>
    )
}

export default connect(({ weapp, loading }) => ({
    weapp,
    loading,
}))(Trainrecord)