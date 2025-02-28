/*eslint no-unused-vars: [2, { "varsIgnorePattern": "^d$" }]*/

import * as actions from "../../actions/fieldlist";
import config from "../../config";
import {describe, it, expect, beforeEach} from "@jest/globals";

import form from "../../reducers/form";


const {fieldList} = config;
const textField = fieldList.find(x => x.id === "text");
const multilineTextField = fieldList.find(x => x.id === "multilinetext");
const radioButtonField = fieldList.find(x => x.id === "radiobuttonlist");

describe("form reducer", () => {
  describe("FIELD_ADD action", () => {
    var state, firstFieldAdded;

    beforeEach(() => {
      state = form(undefined, actions.addField(textField));
      firstFieldAdded = Object.keys(state.schema.properties)[0];
    });

    describe("Empty form", () => {
      describe("schema", () => {
        test("should add a new field to the form schema", () => {
          expect(Object.keys(state.schema.properties))
            .toHaveLength(1);
        });

        it("should generate a sluggified name for the added field", () => {
          expect(firstFieldAdded)
            .toEqual(expect.stringMatching(/^question_\d+/));
        });

        it("should assign the expected title to added field", () => {
          const fieldSchema = state.schema.properties[firstFieldAdded];

          expect(fieldSchema.title).toEqual("Question 1");
        });

        it("should assign the expected type to added field", () => {
          const fieldSchema = state.schema.properties[firstFieldAdded];

          expect(fieldSchema.type).toEqual("string");
        });
      });

      describe("uiSchema", () => {
        it("should have an entry for added field", () => {
          expect(state.uiSchema)
            .toHaveProperty(firstFieldAdded);
        });

        it("should provide an editSchema", () => {
          expect(state.uiSchema[firstFieldAdded].editSchema)
            .toEqual(textField.uiSchema.editSchema);
        });

        it("should initialize field order list", () => {
          expect(state.uiSchema["ui:order"])
            .toEqual([firstFieldAdded]);
        });
      });
    });

    describe("Existing form", () => {
      var newState, secondFieldAdded;

      beforeEach(() => {
        newState = form(state, actions.addField(multilineTextField));
        secondFieldAdded = Object.keys(newState.schema.properties)[1];
      });

      describe("schema", () => {
        it("should add a second field to the form schema", () => {
          expect(Object.keys(newState.schema.properties))
            .toHaveLength(2);
        });

        it("should generate a sluggified name for the second field", () => {
          expect(secondFieldAdded)
            .toEqual(expect.stringMatching(/^question_\d+/));
        });
      });

      describe("uiSchema", () => {
        it("should have an entry for the newly added field", () => {
          expect(newState.uiSchema)
            .toHaveProperty(secondFieldAdded);
        });

        it("should provide an editSchema", () => {
          expect(newState.uiSchema[firstFieldAdded].editSchema)
            .toEqual(multilineTextField.uiSchema.editSchema);
        });

        it("should update the field order list", () => {
          expect(newState.uiSchema["ui:order"])
            .toEqual([firstFieldAdded, secondFieldAdded]);
        });
      });
    });
  });

  describe("FIELD_REMOVE action", () => {
    var state, firstFieldAdded;

    beforeEach(() => {
      state = form(undefined, actions.addField(textField));
      firstFieldAdded = Object.keys(state.schema.properties)[0];
    });

    it("should keep current index", () => {
      const previousIndex = state.currentIndex;
      expect(form(state, actions.removeField(firstFieldAdded)).currentIndex)
        .toEqual(previousIndex);
    });

    describe("Multiple items", () => {
      var removedState;

      beforeEach(() => {
        const intState = form(state, actions.addField(textField));
        const secondField = Object.keys(intState.schema.properties)[1];
        const secondFieldSchema = intState.schema.properties[secondField];
        const requiredState = form(intState, actions.updateField(
          secondField, secondFieldSchema, true, secondFieldSchema.title));
        removedState = form(requiredState,
          actions.removeField(secondField));
      });

      it("should remove a field from the required fields list", () => {
        expect(removedState.schema.required)
          .toBe(undefined);
      });

      it("should remove a field from the uiSchema order list", () => {
        expect(removedState.uiSchema["ui:order"])
          .toEqual([firstFieldAdded]);
      });
    });
  });

  describe("FIELD_UPDATE action", () => {
    var state, firstFieldAdded;

    const newSchema = {
      type: "string",
      title: "updated title",
      description: "updated description"
    };

    beforeEach(() => {
      state = form(undefined, actions.addField(textField));
      firstFieldAdded = Object.keys(state.schema.properties)[0];
    });

    it("should update the form schema with the updated one", () => {
      const action = actions.updateField(firstFieldAdded, newSchema, false,
        firstFieldAdded);

      expect(form(state, action).schema.properties[firstFieldAdded])
        .toEqual(newSchema);
    });

    it("should mark a field as required", () => {
      const action = actions.updateField(firstFieldAdded, newSchema, true,
        firstFieldAdded);

      expect(form(state, action).schema.required)
        .toEqual([firstFieldAdded]);
    });

    it("shouldn't touch uiSchema order", () => {
      const action = actions.updateField(firstFieldAdded, newSchema, false,
        firstFieldAdded);

      expect(form(state, action).uiSchema["ui:order"])
        .toEqual(state.uiSchema["ui:order"]);
    });

    describe("Successful Renaming", () => {
      const newFieldName = "renamed";
      var renamedState;

      beforeEach(() => {
        const action = actions.updateField(
          firstFieldAdded, newSchema, true, newFieldName);
        renamedState = form(state, action);
      });

      it("should expose new field name", () => {
        expect(renamedState.schema.properties[newFieldName])
          .toEqual(newSchema);
      });

      it("should discard previous name", () => {
        expect(renamedState.schema.properties[firstFieldAdded])
          .toBe(undefined);
      });

      it("should update required fields list", () => {
        expect(renamedState.schema.required)
          .toEqual([newFieldName]);
      });

      it("should update uiSchema order", () => {
        expect(renamedState.uiSchema["ui:order"])
          .toEqual([newFieldName]);
      });
    });

    describe("Failed Renaming", () => {
      var secondFieldAdded;

      beforeEach(() => {
        state = form(state, actions.addField(multilineTextField));
        secondFieldAdded = Object.keys(state.schema.properties)[1];
      });

      it("should notify renaming conflicts with an error", () => {
        state = form(state, actions.updateField(secondFieldAdded,
          state.schema.properties[secondFieldAdded], false, firstFieldAdded));

        expect(state.error)
          .toEqual(`Duplicate field name "${firstFieldAdded}", operation aborted.`);
      });
    });
  });

  describe("FIELD_INSERT action", () => {
    var state, firstField, secondField, insertedField;

    beforeEach(() => {
      state = form(undefined, actions.addField(textField));
      state = form(state, actions.addField(multilineTextField));
      firstField = Object.keys(state.schema.properties)[0];
      secondField = Object.keys(state.schema.properties)[1];
      state = form(state, actions.insertField(radioButtonField, secondField));
      insertedField = Object.keys(state.schema.properties)[2];
    });

    it("should insert the new field at the desired position", () => {
      expect(state.uiSchema["ui:order"])
        .toEqual([firstField, insertedField, secondField]);
    });
  });

  describe("FIELD_SWAP action", () => {
    var state, firstField, secondField;

    beforeEach(() => {
      state = form(undefined, actions.addField(textField));
      state = form(state, actions.addField(multilineTextField));
      firstField = Object.keys(state.schema.properties)[0];
      secondField = Object.keys(state.schema.properties)[1];
      state = form(state, actions.swapFields(secondField, firstField));
    });

    it("should swap two fields", () => {
      expect(state.uiSchema["ui:order"])
        .toEqual([secondField, firstField]);
    });
  });

  describe("FORM_RESET action", () => {
    it("should reset the form", () => {
      const initialState = form(undefined, {type: null});
      var state = form(undefined, actions.addField(textField));
      state = form(state, actions.resetForm(() => {
        expect(state).toEqual(initialState);
      }));

    });
  });

  describe("FORM_UPDATE_TITLE action", () => {
    it("should update form properties", () => {
      const state = form(undefined, actions.updateFormTitle({title: "title"}));
      expect(state.schema.title).toEqual("title");
    });
  });

  describe("FORM_UPDATE_DESCRIPTION action", () => {
    it("should update form properties", () => {
      const state = form(undefined, actions.updateFormDescription({description: "description"}));
      expect(state.schema.description).toEqual("description");
    });
  });
});
