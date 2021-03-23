import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Empty } from 'antd';

export default ({ isLoading, isEmpty }) => (
  <div style={{ padding: '4px 0 0 0', textAlign: 'center' }}>
    {isEmpty ? (
      <div className="center">
        <Empty description="没有匹配的数据" style={{ paddingTop: 60 }}></Empty>
      </div>
    ) : isLoading ? (
      <div className="center">
        <LoadingOutlined style={{ marginRight: 12 }}></LoadingOutlined>{' '}
        拼命加载中...
      </div>
    ) : (
      '加载完成'
    )}
  </div>
);
