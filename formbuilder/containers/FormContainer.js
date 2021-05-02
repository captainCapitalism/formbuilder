import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import * as FieldListActions from "../actions/fieldlist";
import DescriptionField from "../components/DescriptionField";
import EditableField from "../components/EditableField";

import Form from "../components/Form";
import TitleField from "../components/TitleField";

function mapStateToProps(state) {
  return {
    error: state.form.error,
    schema: state.form.schema,
    uiSchema: state.form.uiSchema,
    formData: state.form.formData,
    dragndropStatus: state.dragndrop.dragndropStatus
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {...FieldListActions};
  const actions = bindActionCreators(actionCreators, dispatch);
  // Side effect: attaching action creators as EditableField props, so they're
  // available from within the Form fields hierarchy.
  EditableField.defaultProps = Object.assign(
    {}, EditableField.defaultProps || {}, actions);
  TitleField.defaultProps = Object.assign(
    {}, TitleField.defaultProps || {}, actions);
  DescriptionField.defaultProps = Object.assign(
    {}, DescriptionField.defaultProps || {}, actions);
  return actions;
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    SchemaField: EditableField,
    TitleField,
    DescriptionField,
    onChange: () => {}
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Form);
