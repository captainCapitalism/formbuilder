import PropTypes from "prop-types";
import React from "react";
import {RIEInput} from "./DropInRIE/DropInRIEInput";


function TitleField(props) {
  const onUpdate = function (formData) {
    props.updateFormTitle(formData);
  };

  const {id, title = ""} = props;
  return (
    <legend id={id}>
      <RIEInput
        className="edit-in-place"
        propName="title"
        value={title}
        change={onUpdate}/>
    </legend>
  );
}

TitleField.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  required: PropTypes.bool,
};

export default TitleField;
