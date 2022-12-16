import { useState, useEffect } from 'react';
import FetchSelect from '../FetchSelect';
import { CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { uniqueId } from '@/js/utils';
import { notification } from 'antd';
import styles from './index.less';

export default ({
  value,
  onChange,
  request,
  typeList,
  typeField,
  textField,
  debounceTimeout,
  typeWidth,
  responseField = { value: 'value', label: 'label', text: 'text' },
  disabled = false,
}) => {
  const [list, setList] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [disabledList, setDisabledList] = useState([]);

  // 新增一个select
  const addSelect = (defaultOptions) => {
    if (list.length && !list[list.length - 1].value) {
      notification.error({ message: '请先选择内容后再进行添加' });
      return;
    }
    const newItem = {
      uid: uniqueId(),
      value: undefined,
      options: defaultOptions || allOptions,
    };
    setList(list.concat(newItem));
  };

  // 删除当前select
  const deleteSelect = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
    emitValue(newList);
  };

  // 触发select组件的change时间
  const handleChange = (value, index) => {
    const { options, uid } = list[index];
    const newList = [...list];
    newList.splice(index, 1, {
      uid,
      value,
      options,
    });
    setList(newList);
    emitValue(newList);
  };

  // 当前list里的value值改变，向上传递数据
  const emitValue = (newList = []) => {
    const valueList = newList
      .filter((item) => item.value)
      .map((item) => item.value);
    onChange && onChange(valueList);
    const newDisabledList = valueList.map((item) => item[responseField.value]);
    setDisabledList(newDisabledList);
  };

  // 获取所有的数据
  const getAllOptions = async () => {
    const res = await request({});
    setAllOptions(res);
    return res;
  };

  useEffect(() => {
    // 有value的时候赋初始值
    if (value && Array.isArray(value)) {
      const newList = value.map((item) => ({
        uid: uniqueId(),
        value: item,
        options: [item],
      }));
      setList(newList);
      emitValue(newList);
    }

    getAllOptions().then((res) => {
      if (!value || value.length === 0) addSelect(res);
    });
  }, []);

  return (
    <div>
      {list.map((item, index) => {
        return (
          <div className={styles['filter-search-list']} key={item.uid}>
            <FetchSelect
              value={item.value}
              className={styles['filter-search']}
              request={request}
              typeList={typeList}
              typeField={typeField}
              textField={textField}
              manualRequest={false}
              debounceTimeout={debounceTimeout}
              responseField={responseField}
              defaultList={item.options}
              disabledList={disabledList}
              typeWidth={typeWidth}
              onChange={(value) => {
                handleChange(value, index);
              }}
              disabled={disabled}
            />
            {disabled ? undefined : (
              <div className={styles['filter-search-action']}>
                {list.length - 1 === index ? (
                  <PlusCircleOutlined
                    onClick={() => {
                      addSelect();
                    }}
                    className={styles['button-icon']}
                  />
                ) : null}
                {list.length > 1 ? (
                  <CloseCircleOutlined
                    onClick={() => {
                      deleteSelect(index);
                    }}
                    className={styles['button-icon']}
                  />
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
