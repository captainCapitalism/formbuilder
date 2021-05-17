/*eslint no-unused-vars: [2, { "varsIgnorePattern": "^d$" }]*/

import {afterEach, beforeEach, describe, expect, jest, test} from "@jest/globals";
import {addNotification, NOTIFICATION_ADD} from "../../actions/notifications";


describe("notifications actions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    jest.useFakeTimers("modern");

  });
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe("addNotification", () => {
    test("should send info notifications by default", (done) => {
      addNotification("Some info message")(({type, notification}) => {
        expect(type).toEqual(NOTIFICATION_ADD);
        expect(notification.message).toEqual("Some info message");
        expect(notification.type).toEqual("info");
        done();
      });
    });

    test("should send error notifications if specified", (done) => {
      const thunk = addNotification("Some error message", {type: "error"});
      thunk(({type, notification}) => {
        expect(type).toEqual(NOTIFICATION_ADD);
        expect(notification.message).toEqual("Some error message");
        expect(notification.type).toEqual("error");
        done();
      });
    });
    describe("With fake timers", () => {

      test("should dismiss a message after a specific time", () => {
        addNotification("Some dismissable message", {
          type: "info",
          autoDismiss: true,
          dismissAfter: 200
        })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: "NOTIFICATION_ADD",
          notification: {
            id: expect.any(String),
            message: "Some dismissable message",
            type: "info"
          }
        }));
        setTimeout(() => {
          expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "NOTIFICATION_REMOVE",
            id: expect.any(String)
          }));
        }, 201);
      });

      test("should not dismiss an undismissable message", () => {
        addNotification("Some dismissable message", {
          type: "info",
          autoDismiss: false,
          dismissAfter: 2
        })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: "NOTIFICATION_ADD",
          notification: {
            id: expect.any(String),
            message: "Some dismissable message",
            type: "info"
          }
        }));
        setTimeout(() => {
          expect(dispatch).toBeCalledTimes(1);
        }, 3);
        jest.runAllTimers();
      });

      test("should dismiss messages by default", () => {
        addNotification("Some dismissable message")(dispatch);
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
          type: "NOTIFICATION_ADD",
          notification: {
            id: expect.any(String),
            message: "Some dismissable message",
            type: "info"
          }
        }));
        setTimeout(() => {
          expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "NOTIFICATION_REMOVE",
            id: expect.any(String)
          }));
        }, 6000);
        jest.runAllTimers();
      });
    });
  });
});
