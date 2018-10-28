import React from "react";
import "./Links.css";
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
  if (props.isLoggedIn) {
    if (props.link.liked) {
      likeButton = (
        <div
          className="Links-deslike"
          onClick={() => props.handleUnlike(props.link.id)}
        >
          <i className="fas fa-thumbs-down" />
        </div>
      );
    } else {
      likeButton = (
        <div
          className="Links-like"
          onClick={() => props.handleLike(props.link.id)}
        >
          <i className="fas fa-thumbs-up" />
        </div>
      );
    }
  }

  return (
    <div>
      <div className="Links-title">
        <a href={props.link.url} target="_blank">
          {props.link.title}
        </a>
      </div>
      <div className="Links-like-count">{props.link.description}</div>
      <div className="Links-like-count">{props.link.like_count}</div>
      {likeButton}
      {props.link.owned ? (
        <button
          className="Links-delete-button"
          onClick={() => props.handleDeleteLink(props.link.id)}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
