import classNames from "classnames";
import { useRef } from "react";
import { InputCheckboxComponent } from "./types";

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`);

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
        htmlFor={inputId} // Ensure the label is clickable
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={() => {
          console.log("Checkbox clicked. New value:", !checked);
          onChange(!checked);
        }}
      />
    </div>
  );
};
