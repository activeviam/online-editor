import { Button, Typography } from "@material-ui/core";
import React from "react";

import GitHubIcon from "@material-ui/icons/GitHub";

import ReactModal from "react-modal";
import ReactMarkDown from "react-markdown";

const aboutFtBlue = `
## Moad Fethallah
### Ft-Blue
Back end development
`;

const aboutStephanoumenos = `
## Stefano De Checchi
### stephanoumenos

Front end development
`;

const contextAndThanks = `

### Context
---

This website was built from october 2019 to april 2020 as an academic project for CentraleSupélec's third-year curriculum.


### Thanks !

---

We would like to express our gratitude to [CentraleSupélec](https://www.centralesupelec.fr/en) and [ActiveViam](https://www.activeviam.com/) for all their support throughout this project, which has been invaluable.
`;

interface IProps {
  isOpen: boolean;
  onAfterClose: () => void;
  setShowAboutUs: (shouldIt: boolean) => void;
}

export const AboutUsModal = (props: IProps) => {
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
          <div className="menu-left" />
          <div className="menu-right">
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                props.setShowAboutUs(false);
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
        <div style={{ width: "50%", float: "left" }}>
          <ReactMarkDown children={aboutFtBlue} />
          <a href="https://github.com/Ft-Blue">
            <GitHubIcon />
          </a>
        </div>
        <div style={{ width: "50%", float: "left" }}>
          <ReactMarkDown children={aboutStephanoumenos} />
          <a href="https://github.com/stephanoumenos">
            <GitHubIcon />
          </a>
        </div>
        <ReactMarkDown children={contextAndThanks} />
      </Typography>
    </ReactModal>
  );
};
