import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as FieldListActions from "../actions/fieldlist";
import FormActions from "../components/FormActions";
import config from "../config";

function mapStateToProps(state) {
  return {
    fieldList: config.fieldList,
    schema: state.form.schema,
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {...FieldListActions};
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormActions);
