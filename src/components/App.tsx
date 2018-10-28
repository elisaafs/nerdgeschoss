import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import Links from "./Links";
import LinkCreator from "./LinkCreator";
import LoginLogout from "./LoginLogout";
import { Link, NewLink } from "../types/links";
import { organizeByDays } from "../helpers/linkList";

interface Props {}

interface AppState {
  links: Link[];
  sessionId?: string | undefined;
}

class App extends Component<Props, AppState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      links: []
    };
    this.handleNewLinkSubmission = this.handleNewLinkSubmission.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
    this.handleDeleteLink = this.handleDeleteLink.bind(this);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLinkUpdate = this.handleLinkUpdate.bind(this);
  }

  handleLogin(sessionId: string) {
    this.setState({ sessionId });
    this.loadLinks();
  }

  handleLogout() {
    this.setState({ sessionId: undefined });
    this.loadLinks();
  }

  handleLinkUpdate(update: { link: Link } | null) {
    if (update === null) {
      return;
    }

    console.log("Handle update", update.link);

    const isNewLink = !this.state.links.some(
      link => link.id === update.link.id
    );
    if (isNewLink) {
      this.setState({ links: [...this.state.links, update.link] });
    } else {
      const newLinks = this.state.links.map(link => {
        if (link.id === update.link.id) {
          return {
            ...link,
            url: update.link.url,
            title: update.link.title,
            description: update.link.description,
            image_url: update.link.image_url,
            updated_at: update.link.updated_at,
            liked: update.link.liked,
            like_count: update.link.like_count
          };
        } else {
          return link;
        }
      });

      this.setState({ links: newLinks });
    }
  }

  loadLinks() {
    axios
      .get("https://likemachine-api.nerdgeschoss.de/links", {
        headers: {
          Accept: "application/json",
          Authorization:
            this.state.sessionId && "Bearer " + this.state.sessionId
        }
      })
      .then(res => {
        const links = res.data;
        this.setState({ links });
      });
  }

  connectEventSource() {
    const eventSource = new EventSource(
      "https://likemachine-api.nerdgeschoss.de/links"
    );
    eventSource.onmessage = this.handleLinkUpdate as any;
    eventSource.onerror = () => {
      console.log("EventSource failed.");
      //this.connectEventSource();
    };
  }

  componentDidMount() {
    this.loadLinks();
    this.connectEventSource();
  }

  handleNewLinkSubmission(link: NewLink) {
    axios
      .post("https://likemachine-api.nerdgeschoss.de/links", link, {
        headers: {
          Authorization: "Bearer " + this.state.sessionId
        }
      })
      .then(res => {
        const newLinks = [res.data].concat(this.state.links);
        this.setState({ links: newLinks });
      });
  }

  handleLike(linkId: string) {
    axios
      .post(
        `https://likemachine-api.nerdgeschoss.de/links/${linkId}/like`,
        linkId,
        {
          headers: {
            Authorization: "Bearer " + this.state.sessionId
          }
        }
      )
      .then(res => {
        if (res.status === 204) {
          const newLinks = this.state.links.map(link => {
            if (link.id === linkId) {
              return { ...link, like_count: link.like_count + 1, liked: true };
            } else {
              return link;
            }
          });
          this.setState({ links: newLinks });
        } else return null;
      });
  }

  handleUnlike(linkId: string) {
    axios
      .delete(`https://likemachine-api.nerdgeschoss.de/links/${linkId}/like`, {
        headers: {
          Authorization: "Bearer " + this.state.sessionId
        }
      })
      .then(res => {
        if (res.status === 204) {
          const newLinks = this.state.links.map(link => {
            if (link.id === linkId) {
              return { ...link, like_count: link.like_count - 1, liked: false };
            } else {
              return link;
            }
          });
          this.setState({ links: newLinks });
        } else return null;
      });
  }

  handleDeleteLink(linkId: string) {
    axios
      .delete(`https://likemachine-api.nerdgeschoss.de/links/${linkId}`, {
        headers: {
          Authorization: "Bearer " + this.state.sessionId
        }
      })
      .then(res => {
        const oldLinks = this.state.links;
        const newLinks = oldLinks.filter(link => link.id !== linkId);
        this.setState({ links: newLinks });
      });
  }

  render() {
    return (
      <div className="App-page">
        <LoginLogout
          sessionId={this.state.sessionId}
          onLogin={this.handleLogin}
          onLogout={this.handleLogout}
        />
        {this.state.sessionId && (
          <LinkCreator onSubmit={this.handleNewLinkSubmission} />
        )}
        <Links
          links={organizeByDays(this.state.links)}
          handleLike={this.handleLike}
          handleUnlike={this.handleUnlike}
          handleDeleteLink={this.handleDeleteLink}
          isLoggedIn={this.state.sessionId !== undefined}
        />
      </div>
    );
  }
}

export default App;
