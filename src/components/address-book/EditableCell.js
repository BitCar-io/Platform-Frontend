import {Icon, Input, Form, Tooltip} from 'antd';
import React from 'react';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );

export const EditableFormRow = Form.create()(EditableRow);

export const DefaultText = "None provided - click to edit";

export class EditableCell extends React.Component {
    state = {
      editing: false,
    }
  
    componentDidMount() {
      if (this.props.editable) {
        document.addEventListener('click', this.handleClickOutside, true);
      }
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }
  
    handleClickOutside = (e) => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
        this.save();
      }
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    }

    keyPress = (e) => {
      //console.log("key", e);
      if(e.key === "Escape") {
        this.toggleEdit()
      }
    }
  
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        ...restProps
      } = this.props;
      return (
        <td ref={node => (this.cell = node)} {...restProps}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        // rules: [{
                        //   required: true,
                        //   message: `${title} is required.`,
                        // }],
                        initialValue: record[dataIndex] !== DefaultText ? record[dataIndex] : "",
                      })(
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                          addonAfter={<div className="clickable" onClick={this.toggleEdit}><Icon type="close-circle" title="Cancel Changes" /></div>}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                    <Tooltip title="Click here to edit the description, press ENTER to save your changes or click cancel">
                      {restProps.children}
                    </Tooltip>
                    </div>
                  )
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }