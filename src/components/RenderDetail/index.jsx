import { Drawer } from 'antd';
import { useState } from 'react';
import React from 'react';

export default ({ formart,style={} }) => {

  return (
    <div style={style}>
      {
        formart.map((it, i) => {
          return <div>
            <p style={{marginBottom:0}}>{Object.keys(it)[0]}</p>
            <p style={{color:"#999"}}>
              {Object.values(it)[0]}
            </p>
          </div>
        })
      }


    </div>
  );
};
