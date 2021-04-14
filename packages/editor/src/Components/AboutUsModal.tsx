import React from "react";

import GitHubIcon from "@material-ui/icons/GitHub";
import ReactMarkDown from "react-markdown";

import { InformativeModal } from "./InformativeModal";

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

This website was built from october 2020 to april 2021 as an academic project for CentraleSupélec's third-year curriculum.


### Thanks!

---

We would like to express our gratitude to [CentraleSupélec](https://www.centralesupelec.fr/en) and [ActiveViam](https://www.activeviam.com/) for all their invaluable support throughout this project.
`;

interface IProps {
  isOpen: boolean;
  onAfterClose: () => void;
  setShowAboutUs: (shouldIt: boolean) => void;
  children: any;
  title?: string;
}

export const AboutUsModal = (props: IProps) => {
  return (
    <InformativeModal {...props} setOpen={props.setShowAboutUs}>
      <div style={{ width: "50%", float: "left" }}>
        <ReactMarkDown children={aboutFtBlue} />
        <a href="https://github.com/Ft-Blue">
          <GitHubIcon />
        </a>
      </div>
      <div style={{ width: "50%", float: "right" }}>
        <ReactMarkDown children={aboutStephanoumenos} />
        <a href="https://github.com/stephanoumenos">
          <GitHubIcon />
        </a>
      </div>
      <ReactMarkDown children={contextAndThanks} />
    </InformativeModal>
  );
};
