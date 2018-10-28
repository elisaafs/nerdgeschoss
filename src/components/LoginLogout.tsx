import React from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import axios from "axios";

import "./LoginLogout.css";
import config from "../config";
import { Link } from "../types/links";

interface Props {
  sessionId: string | undefined;
  onLogin: (sessionId: string) => void;
  onLogout: () => void;
}

export default class LoginLogout extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleFacebookLogin(response: ReactFacebookLoginInfo) {
    axios
      .post("https://likemachine-api.nerdgeschoss.de/session", {
        facebook_token: response.accessToken
      })
      .then(res => {
        const sessionId: string = res.data.id;
        this.props.onLogin(sessionId);
      });
  }

  handleLogout() {
    axios
      .delete("https://likemachine-api.nerdgeschoss.de/session", {
        headers: {
          Authorization: "Bearer " + this.props.sessionId
        }
      })
      .then(res => {
        this.props.onLogout();
      });
  }

  render() {
    if (this.props.sessionId === undefined) {
      return (
        <FacebookLogin
          appId={config.facebookAppId}
          autoLoad={true}
          scope="public_profile,email"
          callback={this.handleFacebookLogin}
          icon="fa-facebook"
        />
      );
    } else {
      return (
        <button className="LoginLogout-buttom" onClick={this.handleLogout}>
          Logout
        </button>
      );
    }
  }
}
