import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/go/go';
import 'codemirror/mode/lua/lua';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';

export default forwardRef((props, ref) => {
  const textareaRef = useRef(null);
  const { codeChange } = props;
  const [codeEditor, setCodeEditor] = useState();

  useImperativeHandle(ref, () => ({
    changeMode: (mode) => {
      codeEditor.setOption('mode', mode);
    },
    setValue: (value) => {
      codeEditor.setValue(value);
    },
    setReadOnly: (readOnly) => {
      codeEditor.setOption('readOnly', readOnly);
    },
  }));

  // 初始化代码编辑器
  const initCodeMirror = () => {
    const newCodeEditor = CodeMirror.fromTextArea(textareaRef.current, {
      mode: {
        name: 'lua',
        json: true,
      },
      smartIndent: true, // 是否自动缩进
      indentUnit: 4, // 每个缩进块由几个空格组成
      tabSize: 4, // Tab 的宽度
      readOnly: false, // 是否只读
      lineNumbers: true, // 是否在编辑器的左侧显示行号
      lineWrapping: true, // 内容超过编辑器的宽时，应该滚动显示还是换行显示。默认为滚动（false）
      theme: 'darcula',
    });
    newCodeEditor.on('change', (cm) => {
      const value = cm.getValue();
      codeChange && codeChange(value);
    });
    setCodeEditor(newCodeEditor);
  };

  useEffect(() => {
    initCodeMirror();
  }, []);

  return <textarea ref={textareaRef} style={{ height: '100%' }} />;
});
