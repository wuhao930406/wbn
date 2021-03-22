import { Drawer } from 'antd';
import { useState } from 'react';
import React from 'react';

export default ({ url, size, style={} }) => {
  const [visible, setVisible] = useState(false);
  let { preview_url,origin_url } = url?url:{};

  return (
    <div style={style}>
      {url ? (
        <img
          onClick={() => {
            setVisible(true);
          }}
          style={{
            width: size ? size : 30,
            height: size ? size : 30,
            cursor: 'pointer',
          }}
          src={preview_url?preview_url:url}
          onError={e => {
            e.target.src = require('@/assets/default.png');
          }}
        />
      ) : (
        <img
          style={{
            width: size ? size : 30,
            height: size ? size : 30,
            cursor: 'pointer',
          }}
          src={require('@/assets/default.png')}
        />
      )}

      <Drawer
        title="预览"
        placement="top"
        closable={true}
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}
        height="100%"
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${origin_url?origin_url:url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
      </Drawer>
    </div>
  );
};
