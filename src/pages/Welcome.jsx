import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { InitForm } from 'antd-auto-form'



export default function App() {
    const [state, setstate] = useState('');

    return (
        <div style={{ height: '100%' }}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    background: `url(${require("../assets/bgkj.jpg")}) no-repeat center`,
                    backgroundSize: 'cover',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <h2 style={{ textShadow: '0 0 4px #fff', color: '#fff', fontSize: 32 }}>
                    欢迎使用吾帮你
          </h2>
                <p style={{ textShadow: '0 0 4px #fff', color: '#f0f0f0', fontSize: 16 }}>
                    —— 管理工厂、工人、员工、权限...
          </p>
            </div>
        </div>
    )
}
