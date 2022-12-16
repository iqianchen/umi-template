import { Row, Col } from 'antd';
import { Menu, Dropdown } from 'antd';
import { DownOutlined, PoweroffOutlined } from '@ant-design/icons';

const Exat = () => {
  // 退出登录
  const logOut = () => {};

  return (
    <Menu>
      <Menu.Item onClick={logOut}>
        <PoweroffOutlined />
        退出
      </Menu.Item>
    </Menu>
  );
};

export default () => {
  const user = {
    username: 'test',
  };

  return (
    <Row align="middle" justify="space-between">
      <Col></Col>
      <Col>
        <Dropdown overlay={<Exat />}>
          <a href="javascript:;" className="ant-dropdown-link">
            {user.username} <DownOutlined />
          </a>
        </Dropdown>
      </Col>
    </Row>
  );
};
