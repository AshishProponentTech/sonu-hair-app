import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { saveUserToken, getUserToken, LoadUser } from "../../actions";
import { DotIndicator } from "react-native-indicators";

function AuthLoading(props) {
  React.useEffect(() => {
    const bootstrapAsync = () => {
      props.getUserToken();
    };
    bootstrapAsync();
  }, []);

  return <DotIndicator color={props.color.primaryColor} size={8} />;
}

const mapStateToProps = (state) => ({
  token: state.Auth,
  color: state.Theme.colorData,
});

const mapDispatchToProps = (dispatch) => ({
  saveUserToken: () => dispatch(saveUserToken()),
  getUserToken: () => dispatch(getUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
