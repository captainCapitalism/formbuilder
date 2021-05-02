import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as NotificationsActions from "../actions/notifications";
import NotificationList from "../components/NotificationList";

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NotificationsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationList);
