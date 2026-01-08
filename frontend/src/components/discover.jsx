import { useEffect, useRef, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

import { useRetrieveDiscoverQuery } from "../features/call.js";
import FindList from "./findlist.jsx";

export default function Discover() {
  const [findText, makeFindText] = useState("");
  const [dropSeen, makeDropSeen] = useState(false);
  const dropDown = useRef(null);
  const navigate = useNavigate();
  const doLookup = findText.length >= 4;

  const {
    data: searchResults,
    isLoading,
    error,
  } = useRetrieveDiscoverQuery(findText, {
    skip: !doLookup,
  });

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
