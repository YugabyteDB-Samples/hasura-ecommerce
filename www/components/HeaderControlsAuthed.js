import * as React from "react";
import { useAtom } from "jotai";
import { accountReducerAtom, actions } from "../state/AccountState";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { ChevronDownOutline, PersonOutline, ReceiptOutline, LogOutOutline } from "react-ionicons";

const HeaderControlsAuthed = ({ name }) => {
  const [account, dispatch] = useAtom(accountReducerAtom);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const menu = React.useRef();
  useOnClickOutside(menu, () => setMenuOpen(false));

  return (
    <div className="dropdown">
      <button
        className="hidden-tablet header-nav mr-xs"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <PersonOutline color="white" className="mr-xs"/> {name}{" "}
        <ChevronDownOutline color="white"/>
      </button>
      <div className={`menu left ${menuOpen ? "active" : ""}`}>
        <ul ref={menu}>
          <li className="link">
            <a href="/account">
              <PersonOutline color="white" className="mr-xxs"/> My
              Account
            </a>
          </li>
          <li className="link">
            <a href="#!">
             <ReceiptOutline color="white" className="mr-xxs"/> Orders
            </a>
          </li>
          <li className="link">
            <button
              className="btn-reset"
              onClick={() => {
                dispatch({ type: actions.LOGGING_OUT });
              }}
            >
              <span className="hidden-tablet header-nav mr-xs">
                <LogOutOutline color="white" className="mr-xxs"/>{" "}
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderControlsAuthed;
