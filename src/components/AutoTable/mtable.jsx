import React, { PureComponent } from 'react';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';

let defaultsize = localStorage.getItem("size");

function bodyParse(vals) {
  let val = JSON.parse(JSON.stringify(vals))
  let res = ''
  for (let key in val) {
    let mostkey = key, value = val[key] ? val[key] : ''
    res += `&${mostkey}=${value}`;
  }
  return "?" + res.substr(1)
}




class Mtable extends PureComponent {
  state = {
    total: 100,
    size: defaultsize ? defaultsize : "small"
  }
  actionRefs = React.createRef();
  formRefs = React.createRef();

  componentWillReceiveProps(nextprops) {
    if (JSON.stringify(this.props.extraparams) != JSON.stringify(nextprops.extraparams)) {
      if (this.props.actionRef) {
        this.props.actionRef?.current.reload()
      } else {
        this.actionRefs?.current.reload()
      }
    }
  }


  render() {
    let {
      x, y,
      dataSource,
      defaultPageSize,
      bordered,//边框
      pagination, //分页
      columns, //表头
      rowKey, //行key
      actionRef, //操作ref
      formRef, //查询表单ref
      path, //路径
      extraparams = {}, //拓展查询参数
      rowSelection, //行选择
      expandable,//可展开
      tableRender, //表格布局自定义
      getDefaultSelected, //获取默认选中的数据
      rowClassNameFn, //选中后行样式
      showQuickJumper, //false字符串 不显示
      showSizeChanger
    } = this.props,
      { total, size } = this.state,
      { tableTokenkey, tableMethod } = window.dataconfig;
    tableMethod = tableMethod ? tableMethod : "GET";
    tableTokenkey = tableTokenkey ? tableTokenkey : "Authorization";

    let scroll = {};
    if (y) {
      scroll = {
        ...scroll,
        y
      }
    }
    if (x) {
      scroll = {
        ...scroll,
        x
      }
    }

    let tabledataProps = dataSource && Array.isArray(dataSource) ?
      {
        dataSource,
        pagination: {
          showTotal: (total, range) => <span>共{total}条</span>,
          showQuickJumper: false,
          showSizeChanger: false,
          pageSize: defaultPageSize ? defaultPageSize : 10,
          pageSizeOptions: [10, 15, 30, 50, 100, 200],
          total: dataSource.length
        },
        search: {
          filterType: 'light',//轻量模式
        },
        toolBarRender: false
      }
      :
      {
        request: async (params = {}) => {
          //表格数据获取 只需要传入url自动获得数据
          if (!path) {
            return
          }
          //设置token
          let token = localStorage.getItem("TOKEN") ? localStorage.getItem("TOKEN") : "b60ef0c40b7f1b7e63c2b24b127988d4";
          let headers = {
            'Content-Type': 'application/json',
            [tableTokenkey]: token ? token : '',
          };
          //处理传参 extraparams为除列筛选外的自定义传参
          let newparams = {
            ...params,
            ...extraparams,//父组件传参
            pageIndex: params.current,
          }
          delete newparams.current;
          if (pagination == "false") {
            delete newparams.pageIndex;
            delete newparams.pageSize;
          }
          if (newparams.start_time) {
            newparams.start_date = newparams.start_time[0]
            newparams.end_date = newparams.start_time[1]
          }
          if (tableMethod == "GET") {
            return request(path + bodyParse(newparams), {
              headers,
              method: tableMethod,
            })
          } else {
            return request(path, {
              body: JSON.stringify(newparams ? newparams : {}),
              headers,
              method: tableMethod,
            })
          }
        },
        pagination: {
          showTotal: (total, range) => <span>共{total}条</span>,
          showQuickJumper: showQuickJumper === false ? true : false,
          showSizeChanger: showSizeChanger === false ? true : false,
          pageSize: defaultPageSize ? defaultPageSize : 10,
          pageSizeOptions: [5, 10, 15, 30, 50, 100, 200],
          total
        },
        search: {
          filterType: 'light',//轻量模式
        }
      }


    return <ProTable
      size={size}
      onSizeChange={(size) => {
        localStorage.setItem("size", size);//设置全局表格规格缓存
        this.setState({
          size
        })
      }}
      columns={columns.map((it) => {
        if (it.ellipsis) {
        } else {
          it.ellipsis = true;
        }
        return it
      })}
      scroll={scroll}
      actionRef={actionRef ? actionRef : this.actionRefs}
      formRef={formRef ? formRef : this.formRefs}
      rowKey={rowKey ? rowKey : "id"} //表格每行数据的key
      dateFormatter="string"
      postData={(data) => {
        if (data) {
          this.setState({
            total: data?.total
          })
        } else {
          this.setState({
            total: data?.dataList.length
          })
        }
        //分页or不分页获取数据
        getDefaultSelected && getDefaultSelected(data);//存在默认选中向上返回选中值
        let defaultval = ( data?.dataList || data?.list || []);//分页或不分页的接口返回数据
        return defaultval
      }}
      bordered={bordered}
      rowSelection={rowSelection ? rowSelection : false}
      expandable={expandable ? expandable : false}
      tableAlertRender={false} //取消顶部筛选操作
      tableRender={tableRender ? (_, dom) => tableRender(_, dom) : (_, dom) => dom} //自定义表格主体
      rowClassName={rowClassNameFn ? (record, index) => rowClassNameFn(record, index) : ""} //自定义行高亮
      {...tabledataProps}
    />
  }
}




export default Mtable