import { forwardRef, useImperativeHandle, useState } from "react";
import { Dropdown, FloatingLabel, Form, Image } from "react-bootstrap";
import { LookupSpinner } from "./LookupSpinner.jsx";
import { useMinFetching } from "../features/hooks.js";

import { useLookupAccoladeQuery } from "../features/call.js";
import { relativeImageUrl } from "../features/util.js";

const BadgeSearchDropdown = forwardRef(function BadgeSearchDropdown(
  { controlId, label, onSelect, onInputChange, placeholder, required },
  ref
) {
  const [lookup, setLookup] = useState("");
  const [dropdownShow, setDropdownShow] = useState(false);

  const { data: result, isFetching } = useLookupAccoladeQuery(lookup, {
    skip: lookup.length < 4,
  });

  const showAccoladeSpinner = useMinFetching(isFetching);

  useImperativeHandle(ref, () => ({
    reset() {
      setLookup("");
      setDropdownShow(false);
    },
    setValue(val) {
      setLookup(val);
    },
  }));

  const handleSelect = (badge) => {
    setLookup(badge.name);
    setDropdownShow(false);
    onSelect(badge);
  };

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
      </FloatingLabel> {showAccoladeSpinner && <LookupSpinner />}
      {lookup.length >= 4 &&
        result?.badges?.length > 0 &&
        dropdownShow && (
          <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
            <Dropdown.Header className="small p-1">Badges</Dropdown.Header>
            {result.badges.slice(0, 8).map((badge) => (
              <Dropdown.Item
                key={badge.id}
                onClick={() => handleSelect(badge)}
                className="small d-flex align-items-center p-1"
              >
                <Image rounded={true} src={relativeImageUrl(badge.image)} width="40" height="40" className="me-2" />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="fw-bold text-truncate">{badge.name}</div>
                  <div className="small text-muted text-truncate">{badge.description}</div>
                </div>
              </Dropdown.Item>
            ))}
            {result.badges.length > 8 && (
              <Dropdown.Item disabled className="small text-muted p-1">
                +{result.badges.length - 8} more badges
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        )}
    </div>
  );
});

export default BadgeSearchDropdown;