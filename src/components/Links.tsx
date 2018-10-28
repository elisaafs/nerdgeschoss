import React from "react";

import Link from "./Link";
import { LinkGroup } from "../types/links";

import "./Links.css";

interface Props {
  links: LinkGroup[];
  isLoggedIn: boolean;
  handleLike: (linkId: string) => void;
  handleUnlike: (linkId: string) => void;
  handleDeleteLink: (linkId: string) => void;
}

export default function Links(props: Props) {
  return (
    <div className="Links-main">
      {props.links.map(linkGroup => (
        <div key={linkGroup.day} className="Links-group">
          <div className="Links-date">
            {new Date(linkGroup.day).toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </div>
          {linkGroup.links.map((link, index) => (
            <Link key={link.id} link={link} {...props} />
          ))}
        </div>
      ))}
    </div>
  );
}
