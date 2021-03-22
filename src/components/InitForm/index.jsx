import {
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  InputNumber,
  Upload,
  message,
  Radio,
  TreeSelect,
  Button,
  AutoComplete,
  Drawer,
  Cascader,
  ConfigProvider
} from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons"
import EditTable from '../EditTable/index.jsx';
import Editor from '../Editor/index.jsx';
import mockfile from './mockfile.js'
import zhCN from 'antd/lib/locale/zh_CN';
moment.locale('zh-cn');

const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;
let { Option } = Select;



let loop = (data, title, key, children) => (data && data?.length > 0) && data?.map(item => {
  let defaulttitle = title ? title : "title",
    defaultkey = key ? key : "key",
    defaultchildren = children ? children : "children";

  const titles = <span>{item[defaulttitle]}</span>;
  if (item[defaultchildren]) {
    return (
      <TreeNode value={item[defaultkey]} key={item[defaultkey]} title={titles}>
        {loop(item[defaultchildren])}
      </TreeNode>
    );
  } else {
    return <TreeNode value={item[defaultkey]} key={item[defaultkey]} title={titles} />;
  }
});

function filter(inputValue, path) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

function formartData(item, val) {
  let formartValue = val;
  if (item.type == "upload") {
    let stepval = val ? Array.isArray(val) ? val : val.fileList : [];
    formartValue = stepval.map((it) => {
      if (it.response) {
        return it.response.data
      } else {
        return it.url ? it.url : null
      }
    })
    if (item.limit == 1) {
      formartValue = formartValue[0] ? formartValue[0] : ""
    }
  } else if (item.type == "datepicker") {
    formartValue = val ? val.format(item.format ? item.format : "YYYY-MM-DD") : null
  } else if (item.type == "daterange") {
    formartValue = val && Array.isArray(val) ? val.map((it => it ? moment(it).format(item.format ? item.format : "YYYY-MM-DD") : null)) : []
  }
  return formartValue
}





let InitForm = ({ fields, onChange, submitting, submitData, actions, col, mode, formRef, style }) => {
  let [Dom, cDom] = useState([]),
    [cururl, setcururl] = useState(""),
    [loading, sload] = useState(false),
    [form] = Form.useForm(),
    [filelist, cfilelist] = useState({}),
    [link, clink] = useState({}),
    [belink, cbelink] = useState({}),
    [visible, setVisible] = useState(false),
    [optiondom, cdom] = useState({});

  form = formRef ? formRef : form;


  useEffect(() => {
    let Doms = [], klink = {}, belinked = {}, defaultfiles = {};
    for (let i in fields) {
      let record = fields[i];
      //获取linked key
      if (record.linked === true) {
        klink[i] = record.value;
      }
      //获取belinked key
      if (record.belinked) {
        belinked[i] = record.belinked;
      }
      //初始化filelist
      if (record.type === "upload") {
        let curfileList = record.value ? mockfile(Array.isArray(record.value) ? record.value : [record.value]) : [];
        //default value
        defaultfiles[i] = curfileList ? curfileList.fileList ? curfileList.fileList : [] : [];
        //formart value
        record.value = curfileList;



      } else if (record.type === "datepicker") {
        record.value = record.value ? moment(record.value) : undefined;
      } else if (record.type === "daterange") {
        record.value = record.value && Array.isArray(record.value) ? record.value.map(it => it && moment(it)) : [];
      }

      Doms.push(record);
    }
    clink(klink);
    cbelink(belinked);
    cfilelist(defaultfiles);
    cDom(Doms);
  }, [fields]);

  useEffect(() => {
    //联动数据
    for (let i in fields) {
      let extraprops = getSelectLinked(fields[i]);
      let { options } = extraprops;
      getOptions(options, fields[i]);
    }
  }, [link])

  const getCol = (itemcol) => {
    if (itemcol) {
      return itemcol;
    } else {
      return col ? col : { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };
    }
  };

  //表格 联动声明
  const getTableLinked = (item) => {
    let extraparams = {}, oldparams = item.extraparams;
    if (oldparams && Object.keys(oldparams).length > 0) {
      for (let i in oldparams) {
        if (oldparams[i] == "linked") {
          extraparams = {
            ...extraparams,
            [i]: link[i] //获取联动数据
          }
        } else {
          extraparams = {
            ...extraparams,
            [i]: oldparams[i] //获取props传入数据
          }
        }
      }
    }
    return extraparams;
  }

  //下拉框联动声明
  const getSelectLinked = (item) => {
    let names = item.belinked && Object.keys(item.belinked),
      linknames = link && Object.keys(link),
      hides = item.hides,
      options = item.options;

    if (names && names.length > 0) {
      if (item.belinked.hides && item.belinked.hides.length > 0) {
        let requiredlist = item.belinked.hides.filter(it => {
          return it.required
        }).map(it => {
          if (it.equalvalue) {
            let equalvalue = it.equalvalue && Array.isArray(it.equalvalue) && it.equalvalue.length > 0 ? it.equalvalue.indexOf(link[it.name]) != -1 : link[it.name] == it.equalvalue;
            return equalvalue
          } else if (it.unequalvalue) {
            let unequalvalue = it.unequalvalue && Array.isArray(it.unequalvalue) && it.unequalvalue.length > 0 ? it.unequalvalue.indexOf(link[it.name]) == -1 : link[it.name] != it.unequalvalue;
            return unequalvalue
          } else {
            return true
          }
        });

        let unrequiredlist = item.belinked.hides.filter(it => {
          return !it.required
        }).map(it => {
          if (it.equalvalue) {
            let equalvalue = it.equalvalue && Array.isArray(it.equalvalue) && it.equalvalue.length > 0 ? it.equalvalue.indexOf(link[it.name]) != -1 : link[it.name] == it.equalvalue;
            return equalvalue
          } else if (it.unequalvalue) {
            let unequalvalue = it.unequalvalue && Array.isArray(it.unequalvalue) && it.unequalvalue.length > 0 ? it.unequalvalue.indexOf(link[it.name]) == -1 : link[it.name] != it.unequalvalue;
            return unequalvalue
          } else {
            return true
          }
        });
        let rq = requiredlist.some(it => it == true);
        let unrq = unrequiredlist.some(it => it == true);
        hides = hides ? hides : (rq || unrq);
      }

      if (!Array.isArray(item.belinked.options) && item.belinked.options) {
        let { database, params } = item.belinked.options, newparams = {};
        //获取传参联动的值 
        for (let i in params) {
          if (params[i] == "linked") {
            newparams[i] = link[i]
          } else {
            newparams[i] = params[i]
          }
        }
        if (Array.isArray(database)) {
          options = database;
        } else {
          options = {
            database,
            params: newparams
          }
        }
      }
    }
    return {
      hides,
      options,
    }
  }

  //格式化数据提交
  function formartSubmit(values) {
    let newvalue = { ...values };
    for (let i in fields) {
      newvalue[i] = formartData(fields[i], values[i])
    }
    submitData(newvalue, () => {
      form.resetFields();
    })
  }

  const submitBtn = (<Button
    style={{ width: '100%' }}
    htmlType="submit"
    type="primary"
    size="large"
    disabled={submitting || loading}
    onClick={() => {
      form
        .validateFields()
        .then(values => {
          sload(true);
          formartSubmit(values)
          setTimeout(() => {
            sload(false);
          }, 1000);
        })
        .catch(error => { });
    }}
  >
    {submitting || loading ? <LoadingOutlined /> : null}

    <span style={{ marginLeft: 12, fontSize: 16 }}>
      {' '}
      {submitting || loading ? '提交中...' : '提交'}
    </span>
  </Button>)


  let getOptions = async (options, item) => {
    let curkey = item.name[0];
    if (Array.isArray(options)) {
      if (JSON.stringify(optiondom[curkey]) !== JSON.stringify(options)) {
        cdom((optiondom) => {
          return {
            ...optiondom,
            [curkey]: options,
          }
        })
      }
    } else if (options?.database) {
      let { database, params } = options ? options : {}, dom = <></>;
      if (Array.isArray(database)) {
        dom = database
      } else {
        let res = await database(params), dataList = [];
        if (res.code == 0) {
          dataList = res?.data?.dataList.map((it) => {
            let label = item.formart ? item.formart[1] : "name",
              value = item.formart ? item.formart[0] : "id"
            return item.type == "cascader" ? it : {
              label: it[label],
              value: it[value]
            }
          });
        }
        dom = dataList;
      }
      if (JSON.stringify(optiondom[curkey]) !== JSON.stringify(dom)) {
        cdom((optiondom) => {
          return {
            ...optiondom,
            [curkey]: dom,
          }
        })
      }
    }
  }



  return (
    <div style={style}>
      <ConfigProvider locale={zhCN}>
        <Drawer
          title="预览"
          placement="top"
          closable={true}
          onClose={() => { setVisible(false) }}
          visible={visible}
          height="100%"
        >
          <div style={{ width: "100%", height: "100%", backgroundImage: `url(${cururl})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}></div>
        </Drawer>
        <Form
          form={form}
          name="initform"
          layout="vertical"
          fields={Dom}
          onFinish={values => { formartSubmit(values) }}
          onValuesChange={(changedValues, values) => {
            let newvalue = {};
            let linkkey = Object.keys(changedValues)[0];
            //联动逻辑
            for (let i in link) {
              if (i == linkkey) {
                clink({
                  ...link,
                  [i]: changedValues[i] //state修改当前value
                })
                //重置
                if (fields[i].linked) {
                  let keyarr = [];
                  for (let index in belink) {
                    if (belink[index].options && Object.keys(belink[index].options.params).indexOf(i) != -1) {
                      keyarr.push(index)
                    }
                  }
                  keyarr.map((it) => form.setFieldsValue({ [it]: "" }))
                }
              }
            }

            let allValues = form.getFieldsValue();
            for (let i in fields) {
              newvalue[i] = formartData(fields[i], allValues[i]);
              if (linkkey == i) {
                changedValues[i] = formartData(fields[i], allValues[i]);
              }
            }

            onChange(changedValues, newvalue);


          }}
        >
          <Row gutter={24} style={{ position: "relative" }}>
            <Input type="text" name="userName" style={{ position: "absolute", top: -999 }}></Input>
            <Input type="password" style={{ position: "absolute", top: -999 }}></Input>
            {Dom.map(
              (item, i) => {
                let extraprops = getSelectLinked(item);
                let { options } = extraprops;
                if (item.type == 'input' || item.type == 'password') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          {
                            required: item.required,
                            message: `请输入${item.title}`,
                          },
                          item.name[0].indexOf('phone') != -1
                            ? {
                              pattern: /^\d{11}$/,
                              message: '手机号格式不正确',
                            }
                            : item.name[0].indexOf('mail') != -1
                              ? {
                                pattern: /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
                                message: '邮箱格式不正确',
                              }
                              : {},
                        ]}
                      >
                        <Input
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                          placeholder={item.title}
                          allowClear
                          type={item.type}
                          maxLength={100}
                          disabled={item.disabled} />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'editor') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          {
                            required: item.required,
                            message: `请输入${item.title}`,
                          },
                        ]}
                      >
                        <Editor
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                          value={item.value}
                          height={item.height}
                          rerender={item.rerender}
                          serverURL={item.serverURL}
                        ></Editor>
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'autoinput') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          {
                            required: item.required,
                            message: `请输入${item.title}`
                          },
                        ]}
                      >
                        <AutoComplete
                          allowClear
                          placeholder={item.title}
                          disabled={item.disabled}
                          options={(optiondom[item.name[0]] && optiondom[item.name[0]].length > 0)&&optiondom[item.name[0]]}
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                          filterOption={(inputValue, option) => {
                            return option.value && option.value.toString().indexOf(inputValue) !== -1
                          }}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'textarea') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请输入${item.title}` },
                        ]}
                      >
                        <Input.TextArea
                          maxLength={600}
                          rows={4}
                          allowClear
                          disabled={item.disabled}
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'select') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <Select
                          allowClear
                          placeholder="请选择"
                          style={{ width: '100%' }}
                          showSearch
                          mode={item.multiple ? 'multiple' : ''}
                          filterOption={(input, option) =>
                            option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          disabled={item.disabled}
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                        >
                          {
                            (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0) && optiondom[item.name[0]].filter(it => !it.hides).map((it, n) => {
                              return (
                                <Option disabled={it.disabled} key={n} value={it.dicKey ? it.dicKey : it.value}>
                                  {it.dicName ? it.dicName : it.label}
                                </Option>
                              );
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'cascader') {
                  console.log(optiondom[item.name[0]])
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <Cascader
                          fieldNames={item.fieldNames}
                          options={optiondom[item.name[0]]}
                          placeholder="请选择"
                          style={{ width: '100%' }}
                          showSearch={{ filter }}
                          bordered={mode == "simple" ? false : true}
                          disabled={item.disabled}
                          className={mode == "simple" ? "simple" : ""}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'radio') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <Radio.Group
                          options={
                            (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0)
                            &&
                            optiondom[item.name[0]]
                          }
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'datepicker') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <DatePicker
                          className={mode == "simple" ? "simple" : ""}
                          style={{ width: '100%' }}
                          disabledDate={item.disabledDate ? item.disabledDate : null}
                          disabledTime={
                            item.disabledDateTime ? item.disabledDateTime : null
                          }
                          showToday={true}
                          showTime={item.showTime}
                          format={item.format}
                          disabled={item.disabled}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'daterange') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <RangePicker
                          className={mode == "simple" ? "simple" : ""}
                          style={{ width: '100%' }}
                          disabledDate={item.disabledDate ? item.disabledDate : null}
                          disabledTime={
                            item.disabledDateTime ? item.disabledDateTime : null
                          }
                          format={item.format}
                          showToday={true}
                          showTime={item.showTime}
                          disabled={item.disabled}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'inputnumber') {
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请输入${item.title}` },
                        ]}
                      >
                        <InputNumber
                          bordered={mode == "simple" ? false : true}
                          className={mode == "simple" ? "simple" : ""}
                          style={{ width: '100%' }}
                          disabled={item.disabled}
                          min={item.min ? item.min : 0}
                          max={item.max}
                        />
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'upload') {
                  function beforeUpload(file) {
                    let size = window?.dataconfig?.limitSize ? window.dataconfig.serverURL : 20;
                    const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJpgOrPng) {
                      message.error('只能上传.jpg/.jpeg/.png图片!');
                    }
                    const isLt2M = file.size / 1024 / 1024 < size;
                    if (!isLt2M) {
                      message.error('图片大小须小于' + size + 'MB!');
                    }
                    if (item.listType == "img") {
                      return isJpgOrPng && isLt2M;
                    } else {
                      return true
                    }
                  }

                  const props = {
                    name: "file",
                    action: item.serverURL ? item.serverURL : window?.dataconfig?.serverURL,
                    listType: item.listType == "img" ? "picture-card" : 'text',
                    accept: item.listType == "img" ? ".jpg,.png,.jpeg," : "*",
                    multiple: item.multiple ? item.multiple : false,
                    beforeUpload: beforeUpload,
                    fileList: filelist[item.name[0]],
                    onChange(info) {
                      let {
                        file: { name, status, response },
                        fileList,
                      } = info;
                      if (status == 'uploading') {
                        cfilelist({
                          ...filelist,
                          [item.name[0]]: fileList
                        })
                      } else if (status == 'done' || status == 'removed') {
                        cfilelist({
                          ...filelist,
                          [item.name[0]]: fileList.filter((it) => it.response)
                        })
                      } else if (status == 'error') {
                        message.error(`${info.file.name} 上传失败`);
                      } else {
                        cfilelist({
                          ...filelist,
                          [item.name[0]]: fileList.filter((it) => it.response)
                        })
                      }
                    },
                    onPreview(file) {
                      if (file.url) {
                        setcururl(file.url)
                      } else {
                        setcururl(file.thumbUrl)
                      }
                      setVisible(true);
                    },
                  };
                  const uploadBtn =
                    item.listType == 'img' ? (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    ) : (
                        <Button icon={<UploadOutlined />}>上传</Button>
                      ),
                    limit = item.limit ? item.limit : 1000;


                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <Upload {...props} style={{ width: '100%' }}>
                          {
                            (filelist[item.name[0]] && filelist[item.name[0]].length > limit - 1) ? null : uploadBtn
                          }
                        </Upload>
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'treeselect') {
                  let { title, key, children } = item.formart;
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请选择${item.title}` },
                        ]}
                      >
                        <TreeSelect
                          style={{ width: '100%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          disabled={item.disabled}
                          allowClear
                          showSearch
                          treeDefaultExpandAll
                          placeholder={`请选择...`}
                        >
                          {
                            (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0) &&
                            loop(optiondom[item.name[0]], title, key, children)
                          }
                        </TreeSelect>
                      </Form.Item>
                    </Col>
                  ) : null;
                } else if (item.type == 'table') {
                  let extraparams = getTableLinked(item);//声明需要被联动
                  return !extraprops.hides ? (
                    <Col key={i} {...getCol(item.col)}>
                      <Form.Item
                        style={{}}
                        label={item.title}
                        name={item.name[0]}
                        rules={[
                          { required: item.required, message: `请输入${item.title}` },
                        ]}
                      >
                        <EditTable
                          columns={item.columns}
                          extraparams={extraparams}
                          path={item.path}
                          editable={item.editable}
                          rowKey={item.rowKey}
                          rowName={item.rowName}
                          pagination={item.pagination}
                        >
                        </EditTable>
                      </Form.Item>
                    </Col>
                  ) : null;
                }
              })}
            <Col span={24} style={{ padding: 12 }}>
              {actions ? (
                actions(form, submitBtn)
              ) : (
                  submitBtn
                )}
            </Col>
          </Row>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default InitForm;
