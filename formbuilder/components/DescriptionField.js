import React, {PropTypes} from "react";

const RIEInput = props => {
  return (
    <div>
      Placeholder for RIEInput
    </div>
  );
};


function DescriptionField(props) {
  const onUpdate = function (formData) {
    props.updateFormDescription(formData);
  };

  const {id, description = ""} = props;
  return (
    <p id={id}>
      <RIEInput
        className="edit-in-place"
        classEditing="edit-in-place-active"
        propName="description"
        value={description}
        change={onUpdate}/>
    </p>
  );
}

if (process.env.NODE_ENV !== "production") {
  DescriptionField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default DescriptionField;
