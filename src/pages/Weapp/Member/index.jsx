import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Card, Tabs, Button, Modal, Radio, Tag, message } from 'antd'
import AutoTable from '@/components/AutoTable'
import InitForm from '@/components/InitForm'
import { connect, useRequest } from 'umi'
import { member, attention, updatemember } from '@/services/weapp'

import RenderClickImg from '@/components/RenderClickImg'

// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 
const { TabPane } = Tabs;
const tabList = [
    {
        key: 'agent',
        tab: '经纪人',
    },
    {
        key: 'promoter',
        tab: '推广员',
    },
    {
        key: 'user',
        tab: '普通用户',
    },
];

function Member(props) {
    const [vs, cvs] = useState(false),//表单显/隐
        [iftype, ciftype] = useState({

        }),
        [activekey, setactivekey] = useState("agent"),
        [promo_num,cp]=useState("asc");

    const actionRef = useRef();
    let { data } = useRequest(() => attention())

    const [value, setValue] = useState("agent");
    const onChange = e => {
        console.log(e.target.value);
        setValue(e.target.value);
    };

    const columns = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '头像',
            dataIndex: 'head_image',
            key: 'head_image',
            search: false,
            render: (_, record) => {
                return <div className="center">
                    <RenderClickImg url={record.head_image} style={{ margin: "0 2px 2px 0" }}></RenderClickImg>
                </div>
            }
        },
        {
            title: '会员名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            search: false,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            search: false,
        },
        {
            title: '是否关注',
            dataIndex: 'is_attention',
            key: 'is_attention',
            search: false,
            render: (_, record) => {
                return <Tag color={!record.is_attention ? "grey" : "red"}>{!record.is_attention ? "未关注" : "已关注"}</Tag>
            }
        },
        {
            title: '是否为会员',
            dataIndex: 'is_member',
            key: 'is_member',
            search: false,
            render: (_, record) => { //record.is_member
                return <Tag color={!record.is_member ? "grey" : "red"}>{!record.is_member ? "非会员" : "会员"}</Tag>
            }
        },
        {
            title: '下限人数',
            dataIndex: 'promo_num',
            key: 'promo_num',
            search: false,
            render: (_, record) => { //record.is_member
                return <a onClick={() => {
                    cvs(true);
                    member(record.id).then(res => {
                        ciftype({
                            title: record.name + "的下限",
                            list: res.data?.promos
                        })
                    })

                }}>{record.promo_num}</a>
            }
        },
        {
            title: '推广码',
            dataIndex: 'promo_code_url',
            key: 'promo_code_url',
            search: false,
            render: (_, record) => {
                return <div className="center">
                    <RenderClickImg url={record.promo_code_url} style={{ margin: "0 2px 2px 0" }}></RenderClickImg>
                </div>
            }
        },
        {
            title: '操作',
            valueType: 'option',
            width: 170,
            render: (text, record, _, action) => [
                <a onClick={() => {
                    ciftype({
                        ...iftype,
                        title: "修改角色",
                        type: "edit",
                        curitem: record
                    })
                    cvs(true)
                }}>
                    修改角色
                </a>
            ]
        }
    ]


    return (
        <Card title={<a style={{ fontSize: 18, paddingLeft: 6, color: "#333" }}>{props.route.name}</a>} tabProps={{ type: "card" }} tabList={tabList} activeTabKey={activekey} onTabChange={key => {
            setactivekey(key)
        }} extra={<a style={{ color: "#f50" }}>共 <b style={{ fontSize: 24, padding: "0 4px" }}>{data}</b>人关注公众号</a>} tabBarExtraContent={<a onClick={()=>{
            cp((promo_num)=>{
                if(promo_num=="asc"){
                    return "desc"
                }else{
                    return "asc"
                }
            })
        }}>排名{promo_num=="desc"?"由少到多":"由多到少"}</a>}>
            <AutoTable
                columns={columns}
                actionRef={actionRef}
                extraparams={{ identity: activekey,promo_num }}
                path="/api/member"
            ></AutoTable>

            <Modal
                maskClosable={false}
                title={iftype.title}
                visible={vs}
                onCancel={() => cvs(false)}
                footer={iftype.type == "edit" ? [
                    <Button type='primary' onClick={() => {
                        updatemember({ id: iftype.curitem.id, identity: value }).then(res => {
                            actionRef.current.reload();
                            message.success("操作成功！");
                            cvs(false)
                        })
                    }}>修改</Button>
                ] : false}
                width={1000}
                style={{ top: 20 }}
                destroyOnClose={true}
            >
                {
                    iftype.type == "edit" ?
                        <div style={{ padding: 12 }}>
                            <Radio.Group onChange={onChange} defaultValue={iftype.curitem.identity}>
                                <Radio value={"agent"}>经纪人</Radio>
                                <Radio value={"promoter"}>推广员</Radio>
                                <Radio value={"user"}>普通用户</Radio>
                            </Radio.Group>
                        </div>
                        : <AutoTable
                            columns={[
                                {
                                    title: '头像',
                                    dataIndex: 'head_image',
                                    key: 'head_image',
                                    search: false,
                                    render: (_, record) => {
                                        return <div className="center">
                                            <RenderClickImg url={record.head_image} style={{ margin: "0 2px 2px 0" }}></RenderClickImg>
                                        </div>
                                    }
                                },
                                {
                                    title: '会员名称',
                                    dataIndex: 'name',
                                    key: 'name',
                                },
                            ]}
                            dataSource={iftype.list}
                        ></AutoTable>

                }
            </Modal>



        </Card>
    )
}

export default connect(({ weapp, loading }) => ({
    weapp,
    loading,
}))(Member)