import { Button, Typography } from "@material-ui/core";
import React from "react";

import ReactModal from "react-modal";

interface IProps {
  isOpen: boolean;
  onAfterClose: () => void;
  setOpen: (shouldIt: boolean) => void;
  children: any;
  title?: string;
}

export const InformativeModal = (props: IProps) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onAfterClose={props.onAfterClose}
      ariaHideApp={false}
      style={{
        content: { background: "lightyellow" },
        overlay: { zIndex: 3000 },
      }}
    >
      <div style={{ height: "10%" }}>
        <div className="whole-menu">
          <div className="menu-left">
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              {props.title}
            </Typography>
          </div>

          <div className="menu-right">
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                props.setOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      <Typography
        variant="body1"
        style={{
          fontSize: "18px",
          lineHeight: "3",
          textAlign: "justify",
          textJustify: "inter-word",
          marginInline: "10%",
        }}
      >
        {props.children}
      </Typography>
    </ReactModal>
  );
};
