export default [
  {
    path: '/',
    component: '@/layout/BasicLayout',
    props: { exact: true },
    routes: [
      {
        path: 'strategy',
        name: '策略配置平台',
        component: '@/layout/BlankLayout',
        routes: [
          {
            path: 'strategicPoint',
            name: '策略点管理',
            component: '@/pages/strategy/strategicPoint',
          },
          {
            path: 'policyPack',
            name: '策略包管理',
            component: '@/pages/strategy/policyPack',
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: '@/pages/login',
  },
];
