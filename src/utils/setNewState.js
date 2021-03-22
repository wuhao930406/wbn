import { history, useModel } from 'umi';
import { message } from 'antd';


export default function setNewState(
  dispatch,
  path,
  values,
  fn,
) {
  dispatch({
    type: path,
    payload: values,
  }).then((res) => {
    if (res.code == '0001' || res.code == '0008') {
      window.location.replace("/user")
    } else if (res.code == '200') {
      fn ? fn(res) : null;
      //查询数据接口不提示
      if (res.msg) {
        message.success(res.msg);
      }
    } else {
      message.warn(res.msg);
    }
  });
}
