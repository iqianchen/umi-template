import { Select, Spin } from 'antd';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { debounce } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;

/**
 * 远程搜索的下拉组件
 * @param value <String | Number> 当前选中的值
 * @param onChange <Function> 传递最新的值
 * @param request <Promise> 请求数据
 * @param typeList <Array> 将启用类型筛选，传入request请求将多传递一个typeField字段，typeField默认为type，  lg: [{ label: '下拉显示的值', value: '选中值', placeholder: '搜索栏提示语' }]
 * @param typeField <String> request请求type字段名，默认为type，需要同时传入typeList生效
 * @param textField <String> request请求keyword字段名, 默认为keyword
 * @param manualRequest <Boolean> 是否触发首次请求，默认为true
 * @param debounceTimeout <Number> 接口防抖间隔时间，默认为800毫秒
 * @param defaultList <Array> 初始显示下拉数据
 * @param responseField
 * @param props <Object> 远程搜索的下拉组件的其他属性值，详情见antd的Select组件
 */
export default ({
  value,
  onChange,
  request,
  typeList,
  typeField = 'type',
  textField = 'keyword',
  manualRequest = true,
  debounceTimeout = 800,
  defaultList = [],
  className,
  responseField = { value: 'value', label: 'label', text: 'text' },
  disabledList = [],
  typeWidth,
  props,
  disabled = false,
}) => {
  const defaultType = Array.isArray(typeList) ? typeList[0].value : null;
  const defaultPlaceholder = Array.isArray(typeList)
    ? typeList[0].placeholder
    : '请输入';
  const [type, setType] = useState(defaultType);
  const [list, setList] = useState(defaultList);
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [fetching, setFetching] = useState(false);

  // 修改筛选类型
  const changeType = (type) => {
    setType(type);
    const currentPlaceholder =
      typeList.filter((item) => item.value === type)[0].placeholder || '请输入';
    setPlaceholder(currentPlaceholder);
  };

  // 筛选类型
  const selectType = useMemo(() => {
    if (!typeList || typeList.length === 0) return null;
    return (
      <Select
        disabled={disabled}
        style={typeWidth ? { flex: `0 0 ${typeWidth}px` } : null}
        className={styles['filter-type']}
        defaultValue={typeList[0].value}
        onChange={(type) => {
          changeType(type);
        }}
        options={typeList}
      />
    );
  }, [typeList]);

  // 远程搜索数据，做防抖处理
  const fetchData = debounce((params) => {
    setFetching(true);
    request &&
      request(params || {})
        .then((res) => {
          setFetching(false);
          setList(res);
        })
        .catch((err) => {
          setFetching(false);
        });
  }, debounceTimeout);

  // useEffect(() => {
  //   if (value && list.length === 0) {
  //     setList([value]);
  //   }
  // }, [value, list]);

  useEffect(() => {
    if (defaultList && defaultList.length) {
      setList(defaultList);
    }

    if (value && list.length === 0) {
      setList([value]);
    }

    if (!value && list.length === 0 && manualRequest) {
      fetchData();
    }
  }, []);

  // 搜索值发生变化
  const handleSearch = (keyword) => {
    let newParams = {
      [textField]: keyword,
    };
    if (typeList && type) {
      newParams[typeField] = type;
    }
    fetchData(newParams);
  };

  // 选中搜索的内容
  const handleChange = (newValue) => {
    if (!newValue) return;
    const selectedItem = list.filter(
      (item) => item[responseField.value] == newValue,
    )[0];
    onChange && onChange(selectedItem);
  };

  // 计算哪些值被禁用
  const isDisabled = useCallback(
    (value) => {
      if (disabledList.length === 0) return false;
      const needDisable = disabledList.some((item) => item === value);
      return needDisable;
    },
    [disabledList],
  );

  return (
    <div className={`${styles['filter-search-wrapper']} ${className}`}>
      {selectType}
      <Select
        className={styles['filter-search']}
        showSearch
        showArrow={false}
        filterOption={false}
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        value={value && value[responseField.value]}
        notFoundContent={fetching ? <Spin size="small" /> : undefined}
        disabled={disabled}
        {...props}
      >
        {Array.isArray(list) &&
          list.map((item) => (
            <Option
              key={item[responseField.value]}
              value={item[responseField.value]}
              disabled={isDisabled(item[responseField.value])}
            >
              <div className={styles['option-item']}>
                <span
                  className={styles['option-item-label']}
                  title={item[responseField.label]}
                >
                  {item[responseField.label]}
                </span>
                <span className={styles['option-item-value']}>
                  {item[responseField.text]}
                </span>
              </div>
            </Option>
          ))}
      </Select>
    </div>
  );
};
