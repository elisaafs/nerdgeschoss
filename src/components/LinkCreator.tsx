import React from "react";
import "./LinkCreator.css";

import { NewLink } from "../types/links";

interface Props {
  onSubmit: (link: NewLink) => void;
}

export default class LinkCreator extends React.Component<Props> {
  state = {
    url: ""
  };

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const link = {
      url: this.state.url
    };

    this.props.onSubmit(link);
    this.setState({ url: "" });
  };

  render() {
    return (
      <div>
        <form className="LinkCreator-form" onSubmit={this.handleSubmit}>
          <input
            className="LinkCreator-url"
            type="text"
            placeholder="Url"
            name="url"
            value={this.state.url}
            onChange={this.handleUrlChange}
          />
          <button className="LinkCreator-button" type="submit">
            Post
          </button>
        </form>
      </div>
    );
  }
}
