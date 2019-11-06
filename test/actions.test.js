import * as actions from "actions";

describe("actions", () => {
  it("should toggle pending", () => {
    const expectedAction = {
      type: actions.TOGGLE_PENDING,
      isPending: false
    };
    expect(actions.togglePending(false)).toEqual(expectedAction);
  });
  // it("should toggle trader registered", () => {
  //   const expectedAction = {
  //     type: actions.TOGGLE_TRADER_REGISTERED,
  //     isTrader: true
  //   };
  //   expect(actions.toggleTraderRegistered(true)).toEqual(expectedAction);
  // });
//   it("should toggle pending", () => {
//     const expectedAction = {
//       type: actions.TOGGLE_PENDING,
//       isPending: false
//     };
//     expect(actions.togglePending(false)).toEqual(expectedAction);
//   });
});
