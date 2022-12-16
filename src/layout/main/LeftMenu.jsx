import { Menu } from 'antd';
import { history } from 'umi';
import { routesToMenu } from '@/js/utils';
import routes from '../../../config/routes';

const { SubMenu } = Menu;

// 渲染子菜单
const renderSubMenu = (menu) => {
  // 点击子菜单，跳转到对应路由
  const menuItemClick = (menuItem) => {
    history.push(menuItem.router);
  };
  return menu.children ? (
    <SubMenu key={menu.name} title={menu.name}>
      {menu.children.map((subMenu) => renderSubMenu(subMenu))}
    </SubMenu>
  ) : (
    <Menu.Item
      key={menu.name}
      onClick={() => {
        menuItemClick(menu);
      }}
    >
      {menu.name}
    </Menu.Item>
  );
};

export default () => {
  const menuRoutes = routes[0].routes;
  const menuList = routesToMenu(menuRoutes);

  return (
    <Menu theme="dark" mode="inline">
      {menuList.map((menu) => renderSubMenu(menu))}
    </Menu>
  );
};
