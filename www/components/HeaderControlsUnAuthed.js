import * as React from "react";
import { PersonOutline } from "react-ionicons";

const HeaderControlsUnAuthed = () => {
  return (
    <React.Fragment>
      <a href="/account/signup">
        <span className="hidden-tablet header-nav mr-xs">
          <PersonOutline color="white"/> Signup
        </span>
      </a>
      <a href="/account/login">
        <span className="hidden-tablet header-nav mr-xs">
          <PersonOutline color="white"/> Login
        </span>
      </a>
    </React.Fragment>
  );
};

export default HeaderControlsUnAuthed;
