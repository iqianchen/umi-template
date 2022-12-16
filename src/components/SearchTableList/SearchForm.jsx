import { Form } from 'antd';
import { useState, useCallback } from 'react';
import styles from './index.less';

// 搜索表单
export default ({
  config = [],
  initialValues = {},
  fixedFields = {},
  paramsChange,
  tableRef = {},
}) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(initialValues);
  // 每次表单里的值修改都会触发
  const formValueChange = (item) => {
    const formValue = form.getFieldsValue();
    const queryParams = { ...formValue, ...fixedFields };
    tableRef.current && tableRef.current.reset();
    setFormValues(queryParams);
    const { customChange } = item;
    // 是否需要自定义onChange事件
    if (customChange) {
      // 返回新的参数调用接口，如果返回false则不调用接口
      const newQueryParams = customChange(queryParams);
      newQueryParams && paramsChange(newQueryParams);
    } else {
      paramsChange(queryParams);
    }
  };

  const computedClass = useCallback(
    (name) => {
      if (
        formValues[name] !== undefined &&
        formValues[name] !== '' &&
        formValues[name] !== null
      ) {
        return `${styles['selected-item']}`;
      }
      return '';
    },
    [formValues],
  );

  return (
    <Form
      form={form}
      layout="inline"
      preserve={false}
      initialValues={initialValues}
    >
      {config.map((item) => (
        <Form.Item
          key={item.name}
          name={item.name}
          {...item.props}
          className={computedClass(item.name)}
        >
          <item.Component
            form={form}
            className={styles['default-width']}
            onChange={() => {
              formValueChange(item);
            }}
            {...item.comProps}
          />
        </Form.Item>
      ))}
    </Form>
  );
};
