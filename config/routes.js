export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: '欢迎',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/basic',
                name: '系统基础管理',
                icon: 'setting',
                routes: [
                  {
                    path: '/basic/paytip',
                    name: '提成设置',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/payway',
                    name: '收款方式',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/paypriod',
                    name: '收款周期',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/customertype',
                    name: '客户公司类型',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/area',
                    name: '经营区域',
                    component: './Basic/User',
                    routes:[
                      {
                        path: '/basic/area/a',
                        name: '编码规则配置',
                        component: './Basic/User',
                      },{
                        path: '/basic/area/b',
                        name: '收款账户配置',
                        component: './Basic/User',
                      }
                    ]


                  },
                  {
                    path: '/basic/department',
                    name: '部门管理',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/user',
                    name: '职员管理',
                    component: './Basic/User',
                  },
                  {
                    path: '/basic/role',
                    name: '角色管理',
                    component: './Basic/Role',
                  },
                  {
                    path: '/basic/menu',
                    name: '菜单权限',
                    component: './Basic/Menu',
                  },
                  
                ],
              },
              {
                path: '/weapp',
                name: '公众号信息管理',
                icon: 'wechat',
                routes: [
                  {
                    path: '/weapp/member',
                    name: '会员管理',
                    component: './Weapp/Member',
                  },
                  {
                    path: '/weapp/customer',
                    name: '客服管理',
                    component: './Weapp/Customer',
                  },
                  
                  {
                    path: '/weapp/store',
                    name: '门店管理',
                    component: './Weapp/Store',
                  },
                  {
                    path: '/weapp/factory',
                    name: '工厂管理',
                    component: './Weapp/Factory',
                  },
                  {
                    path: '/weapp/train',
                    name: '车次管理',
                    component: './Weapp/Train',
                  },
                  {
                    path: '/weapp/keyword',
                    name: '招聘岗位关键词',
                    component: './Weapp/Keyword',
                  },
                  {
                    path: '/weapp/classify',
                    name: '招聘岗位分类',
                    component: './Weapp/Classify',
                  },
                  {
                    path: '/weapp/recruit',
                    name: '招聘岗位管理',
                    component: './Weapp/Recruit',
                  },
                  {
                    path: '/weapp/enroll',
                    name: '报名信息管理',
                    component: './Weapp/Enroll',
                  },
                  {
                    path: '/weapp/banner',
                    name: '公众号轮播图',
                    component: './Weapp/Banner',
                  },
                ],
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
