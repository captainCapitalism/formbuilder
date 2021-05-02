import SchemaField from "@rjsf/core/lib/components/fields/SchemaField";
import React from "react";

import FormActionsContainer from "../containers/FormActionsContainer";

export default function Form(props) {
  const {error, dragndropStatus} = props;
  console.log("dragndropstatus", dragndropStatus);

  const registry = {
    ...SchemaField.defaultProps.registry,
    fields: {
      ...SchemaField.defaultProps.registry.fields,
      SchemaField: props.SchemaField,
      TitleField: props.TitleField,
      DescriptionField: props.DescriptionField,
    }
  };

  return (
    <div>
      {error ? <div className="alert alert-danger">{error}</div> : <div/>}
      <div className="rjsf builder-form">
        <SchemaField {...props} registry={registry}/>
      </div>

      <FormActionsContainer {...props}/>
    </div>
  );
}
