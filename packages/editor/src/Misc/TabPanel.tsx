import React from "react";

/*
This is used to define what tab will show depending on value.
*/

export const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className="tab-panel"
      {...other}
    >
      {value === index && children}
    </div>
  );
};
