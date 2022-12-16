// 防抖函数
/* eslint-disable */
const debounce = (fn, delay = 500) => {
  // timer 是在闭包中的
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
};
/* eslint-enable */

// 生成全局唯一的id
const uniqueId = () => {
  const localTime = new Date().getTime();
  return localTime + Math.ceil(Math.random() * 10000);
};

// 将路由配置转换成菜单
const routesToMenu = (routes = [], curPath = '') => {
  const data = routes.map((item) => {
    let children = undefined;
    const reg = /^\//;
    // eslint-disable-next-line
    const path = `${curPath}${
      reg.test(item.path) ? item.path : '/' + item.path
    }`;

    if (item.routes && item.routes.length > 0) {
      children = routesToMenu(item.routes, path);
    }

    return {
      name: item.name,
      router: path,
      children,
    };
  });

  return data;
};

export { debounce, uniqueId, routesToMenu };
