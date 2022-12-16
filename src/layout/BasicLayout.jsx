import { Layout, ConfigProvider } from 'antd';
import LeftMenu from './main/LeftMenu';
import HeadInfo from './main/HeadInfo';
import zhCN from 'antd/es/locale/zh_CN';
import './index.less';

const { Header, Sider, Content } = Layout;

export default ({ children }) => (
  <ConfigProvider locale={zhCN}>
    <Layout className="page-layout">
      <Sider>
        {/* 侧边菜单栏 */}
        <LeftMenu />
        {/* <div>111</div> */}
      </Sider>
      <Layout>
        <Header>
          {/* 顶部信息栏 */}
          <HeadInfo />
        </Header>
        {/* 主体内容 */}
        <Content>{children}</Content>
      </Layout>
    </Layout>
  </ConfigProvider>
);
