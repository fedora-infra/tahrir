import { forwardRef, useImperativeHandle, useState } from "react";
import { Dropdown, FloatingLabel, Form, Image } from "react-bootstrap";

import { LookupSpinner } from "./LookupSpinner.jsx";
import { useMinFetching } from "../features/hooks.js";

import { useLookupIdentityQuery } from "../features/call.js";
import { portraitProvider } from "../features/util.js";

const UserSearchDropdown = forwardRef(function UserSearchDropdown(
  { controlId, label, onSelect, onInputChange, placeholder, required, renderSubtitle },
  ref
) {
  const [lookup, setLookup] = useState("");
  const [dropdownShow, setDropdownShow] = useState(false);

  const { data: result, isFetching } = useLookupIdentityQuery(lookup, {
    skip: lookup.length < 4,
  });

  const showIdentitySpinner = useMinFetching(isFetching);

  useImperativeHandle(ref, () => ({
    reset() {
      setLookup("");
      setDropdownShow(false);
    },
    setValue(val) {
      setLookup(val);
    },
  }));

  const handleSelect = (user) => {
    setLookup(user.nickname);
    setDropdownShow(false);
    onSelect(user);
  };

  const subtitle = renderSubtitle || ((user) => `#${user.rank}`);

  return (
    <div className="position-relative">
      <FloatingLabel controlId={controlId} label={label}>
        <Form.Control
          type="text"
          value={lookup}
          onChange={(e) => {
            setLookup(e.target.value);
            setDropdownShow(e.target.value.length >= 4);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => lookup.length >= 4 && setDropdownShow(true)}
          onBlur={() => setTimeout(() => setDropdownShow(false), 150)}
          placeholder={placeholder}
          autoComplete="off"
          required={required}
        />
      </FloatingLabel> {showIdentitySpinner && <LookupSpinner />}
      {lookup.length >= 4 &&
        result?.users?.length > 0 &&
        dropdownShow && (
          <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
            <Dropdown.Header className="small p-1">Users</Dropdown.Header>
            {result.users.slice(0, 8).map((user) => (
              <Dropdown.Item
                key={user.id}
                onClick={() => handleSelect(user)}
                className="small d-flex align-items-center p-1"
              >
                <Image rounded={true} src={portraitProvider(user.email, 40)} width="40" height="40" className="me-2" />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-truncate">{user.nickname}</div>
                  <div className="small text-muted text-truncate">{subtitle(user)}</div>
                </div>
              </Dropdown.Item>
            ))}
            {result.users.length > 8 && (
              <Dropdown.Item disabled className="small text-muted p-1">
                +{result.users.length - 8} more users
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        )}
    </div>
  );
});

export default UserSearchDropdown;