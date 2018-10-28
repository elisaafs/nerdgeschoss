import React from "react";
import "./Link.css";
import { Link as LinkType } from "../types/links";

interface Props {
  link: LinkType;
  isLoggedIn: boolean;
  handleLike: (linkId: string) => void;
  handleUnlike: (linkId: string) => void;
  handleDeleteLink: (linkId: string) => void;
}

export default function Link(props: Props) {
  let likeButton;
  let unlikeButton;
  if (props.isLoggedIn) {
    if (!props.link.liked) {
      likeButton = (
        <div
          className="Link-like"
          onClick={() => props.handleLike(props.link.id)}
        >
          <i className="fas fa-thumbs-up" />
        </div>
      );
    } else {
      likeButton = (
        <div className="Link-like Link-liked">
          <i className="fas fa-thumbs-up" />
        </div>
      );
      unlikeButton = (
        <div
          className="Link-like"
          onClick={() => props.handleUnlike(props.link.id)}
        >
          <i className="fas fa-thumbs-down" />
        </div>
      );
    }
  }

  return (
    <div>
      <div className="Link">
        <a className="Link-title" href={props.link.url} target="_blank">
          {props.link.title || props.link.url}
        </a>
      </div>
      <div className="Link-description">{props.link.description}</div>
      <div className="Link-wrapper">
        <div className="Link-like-count">{props.link.like_count}</div>
        {likeButton}
        {unlikeButton}
      </div>
      {props.link.owned ? (
        <button
          className="Link-delete-button"
          onClick={() => props.handleDeleteLink(props.link.id)}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
