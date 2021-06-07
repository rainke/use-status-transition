import { renderHook } from "@testing-library/react-hooks";

import useStatusTransition, { Status } from "../src/useStatusTransition";

it("should not transition on mount: true", () => {
  const { result } = renderHook(() => useStatusTransition({ active: true }));
  expect(result.current).toEqual(Status.Entered);
});

it("should not transition on mount: false", () => {
  const { result } = renderHook(() => useStatusTransition({ active: false }));
  expect(result.current).toEqual(Status.Exited);
});

it("should transition on mount with `appear`", (done) => {
  const { result, waitForNextUpdate } = renderHook(() =>
    useStatusTransition({ active: true, appear: true })
  );

  expect(result.current).toEqual(Status.Enter);

  waitForNextUpdate().then(() => {
    expect(result.current).toEqual(Status.Entering);
    waitForNextUpdate().then(() => {
      expect(result.current).toEqual(Status.Entered);
      done();
    });
  });
});
it("should transition when active changed", (done) => {
  const props = {
    active: false,
    timeout: 500,
  };
  const hook = renderHook(() => useStatusTransition(props));
  props.active = true;
  hook.rerender(props);

  expect(hook.result.current).toEqual(Status.Enter);

  hook.waitForNextUpdate().then(() => {
    expect(hook.result.current).toEqual(Status.Entering);
    hook.waitForNextUpdate().then(() => {
      expect(hook.result.current).toEqual(Status.Entered);
      done();
    });
  });
});
