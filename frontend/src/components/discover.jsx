import { useEffect, useRef, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

import { useRetrieveDiscoverQuery } from "../features/call.js";
import { useMinFetching } from "../features/hooks.js";
import FindList from "./findlist.jsx";
import { LookupSpinner } from "./LookupSpinner.jsx";

export default function Discover() {
  const [findText, makeFindText] = useState("");
  const [dropSeen, makeDropSeen] = useState(false);
  const [clearSeen, makeClearSeen] = useState(false);
  const dropDown = useRef(null);
  const navigate = useNavigate();
  const doLookup = findText.length >= 4;

  const {
    data: searchResults,
    isLoading,
    isFetching,
    error,
  } = useRetrieveDiscoverQuery(findText, {
    skip: !doLookup,
  });

  const showSpinner = useMinFetching(isFetching);

  useEffect(() => {
    const handleDepart = (event) => {
      if (dropDown.current && !dropDown.current.contains(event.target)) {
        makeDropSeen(false);
      }
    };
    document.addEventListener("mousedown", handleDepart);
    return () => {
      document.removeEventListener("mousedown", handleDepart);
    };
  }, []);

  const handleChange = (e) => {
    const text = e.target.value;
    makeFindText(text);
    makeDropSeen(text.trim().length >= 4);
    makeClearSeen(text.trim().length >= 1);
  };

  const handleResult = () => {
    makeDropSeen(false);
    makeFindText("");
  };

  const handleSubmit = () => {
    if (findText.trim().length >= 4) {
      navigate(`/discover/${encodeURIComponent(findText.trim())}`);
      handleResult();
    }
  };

  const handleReturn = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    makeFindText("");
    makeClearSeen(false);
    makeDropSeen(false);
  };

  const hasResults = searchResults && (searchResults.badges?.length > 0 || searchResults.users?.length > 0);

  return (
    <div className="position-relative" ref={dropDown}>
      <Form.Control
        type="text"
        placeholder="Search"
        size="sm"
        value={findText}
        onChange={handleChange}
        onKeyDown={handleReturn}
        onFocus={() => doLookup && makeDropSeen(true)}
        autoComplete="off"
      />
      {showSpinner && <LookupSpinner />}

      {!showSpinner && clearSeen && (
        <button
          type="button"
          className="position-absolute top-50 translate-middle-y end-0 ps-1 border-0 bg-body"
          style={{ paddingRight: "0.50rem" }}
          onClick={handleClear}
        >
          &times;
        </button>
      )}

      {dropSeen && doLookup && (
        <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
          {error && (
            <Dropdown.Item disabled className="small text-danger">
              Search failed
            </Dropdown.Item>
          )}

          {!isLoading && !error && !hasResults && (
            <Dropdown.Item className="small" disabled>
              No results found
            </Dropdown.Item>
          )}

          {searchResults?.badges?.length > 0 && (
            <FindList type="accolade" list={searchResults.badges} hide={handleResult} />
          )}

          {searchResults?.badges?.length > 0 && <Dropdown.Divider className="mt-0 mb-0" />}

          {searchResults?.users?.length > 0 && (
            <FindList type="identity" list={searchResults.users} hide={handleResult} />
          )}
        </Dropdown.Menu>
      )}
    </div>
  );
}
