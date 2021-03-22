import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import React, { useMemo } from 'react';
import { Upload, Button, message } from "antd";
import styles from './UserLayout.less';
import { PictureOutlined } from '@ant-design/icons';
import setNewState from '@/utils/setNewState';


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
    global
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });

  const propes = {
    name: 'file',
    action: '',
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        getBase64(info.file.originFileObj, imageUrl => {
          setNewState(props.dispatch, "global/localbg", imageUrl)
        });
      }
    },
  };

  useMemo(() => {
    console.log(global.localbg)
  }, [global])

  return (
    <HelmetProvider>
      <div className={global.localbg && global.localbg != "null" ? styles.containers : styles.container} style={{ backgroundImage: `url(${global.localbg})`, backgroundRepeat: "no-repeat" }}>
        <div className={styles.upload}>
          <Upload
            {...propes}
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<PictureOutlined style={{ color: "#fff", fontSize: 18 }} />}
            />
          </Upload>
        </div>

        {children}
        <DefaultFooter
          links={false}
          copyright={<a style={{ color: "rgba(255,255,255,0.6)" }}>2021 天辰网络有限公司出品</a>}
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            margin: "auto"
          }} />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings, global }) => ({ ...settings, global }))(UserLayout);
