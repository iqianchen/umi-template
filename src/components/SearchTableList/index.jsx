import { useRef, useState, useEffect, useImperativeHandle } from 'react';
import ProTable from '@ant-design/pro-table';
import SearchForm from './SearchForm';
import styles from './index.less';

/**
 * 带搜索的表格列表组件
 * @param buttonOptions <Array> 按钮列表  lg: [<Button>新增</Button>， <Button>导出</Button>]
 * @param search <Object | False> 是否需要开启搜索项，默认不开启
 * @param search.initialValues <Object> 初始化搜索栏的默认值， 默认为空
 * @param search.fixedFields <Object> 每次搜索固定传值， 默认为空
 * @param search.config <Array> 搜索栏的配置项
 * @param search.config[].Component  组件
 * @param search.config[].name 当前筛选的key
 * @param search.config[].comProps 给组件赋予props属性
 * @param rowKey <String> 表格行key的取值
 * @param columns <Array> 表格列配置项，详情参考proTable的API
 * @param request <Function> 从服务器请求枚举，详情参考proTable的API
 * @param tableProps <Object> proTable的其他属性值，详情参考proTable的API
 * @param getTableRef <Function> 获取proTable的实例
 * @param className <String>
 * 组件proTable的API地址：https://procomponents.ant.design/components/table/#api
 */
export default ({
  buttonOptions = [],
  search = false,
  rowKey,
  columns,
  request,
  tableProps,
  getTableRef,
  actionRef: propsActionRef,
  className: propsClassName = '',
}) => {
  const actionRef = useRef(null);
  const [params, setParams] = useState({});

  const paramsChange = (params) => {
    setParams(params);
  };

  useImperativeHandle(propsActionRef, () => actionRef.current);

  useEffect(() => {
    // 默认搜索的初始值
    let newParmas = null;
    if (search && search.initialValues) {
      newParmas = { ...search.initialValues };
    }
    if (search && search.fixedFields) {
      newParmas = { ...newParmas, ...search.fixedFields };
    }
    newParmas && setParams(newParmas);

    getTableRef && getTableRef(actionRef.current);
  }, []);

  return (
    <div className={`${styles['search-table-list']} ${propsClassName}`}>
      <div className={styles['header-wrapper']}>
        <div className={styles['header-button-wrapper']}>
          {buttonOptions.map((item) => (
            <item.type
              key={item.key}
              {...item.props}
              onClick={() => {
                item.props.onClick(actionRef.current);
              }}
            />
          ))}
        </div>

        {search && (
          <SearchForm
            tableRef={actionRef}
            config={search.config}
            initialValues={search.initialValues}
            fixedFields={search.fixedFields}
            paramsChange={paramsChange}
          />
        )}
      </div>

      <ProTable
        search={false}
        params={params}
        toolBarRender={false}
        actionRef={actionRef}
        pagination={{ defaultPageSize: 10 }}
        rowKey={rowKey}
        columns={columns}
        request={request}
        debounceTime={300}
        onDataSourceChange={() => {
          actionRef.current && actionRef.current.clearSelected();
        }}
        {...tableProps}
      />
    </div>
  );
};
