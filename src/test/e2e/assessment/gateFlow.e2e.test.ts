import { describe, expect, it } from "vitest";
import {
  gateReducer,
  initialGateState,
  type GateAction,
  type GateState,
} from "../../../assessment/gateStateMachine";

function run(actions: GateAction[], seed = initialGateState): GateState {
  return actions.reduce((state, action) => gateReducer(state, action), seed);
}

describe("ST-033 gate flow e2e", () => {
  it("enforces strict linear progression and blocks invalid transitions", () => {
    const illegalPassFromIdle = gateReducer(initialGateState, {
      type: "CHECK_RESULT",
      passed: true,
      checkResults: [],
      score: 100,
    });
    expect(illegalPassFromIdle).toEqual(initialGateState);

    const gatePassed = run([
      { type: "SUBMIT_ATTEMPT" },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 30 },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 80 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: true, checkResults: [], score: 80 },
    ]);

    expect(gatePassed.status).toBe("passed");
    expect(gatePassed.attempts).toBe(2);
    expect(gatePassed.unlockedHintTiers).toEqual([1]);

    const postPassSubmit = gateReducer(gatePassed, { type: "SUBMIT_ATTEMPT" });
    const postPassReset = gateReducer(gatePassed, { type: "RESET" });

    expect(postPassSubmit).toEqual(gatePassed);
    expect(postPassReset).toEqual(gatePassed);
  });

  it("enforces soft-block remediation before another attempt cycle", () => {
    const softBlocked = run([
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 20 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 20 },
      { type: "SUBMIT_ATTEMPT" },
      { type: "CHECK_RESULT", passed: false, checkResults: [], score: 20 },
    ]);

    expect(softBlocked.status).toBe("soft-blocked");
    expect(softBlocked.attempts).toBe(0);
    expect(softBlocked.unlockedHintTiers).toEqual([1, 2, 3]);

    const blockedSubmission = gateReducer(softBlocked, { type: "SUBMIT_ATTEMPT" });
    expect(blockedSubmission).toEqual(softBlocked);

    const remediated = gateReducer(softBlocked, { type: "DISMISS_SOFT_BLOCK" });
    const retrying = gateReducer(remediated, { type: "SUBMIT_ATTEMPT" });

    expect(remediated.status).toBe("idle");
    expect(remediated.unlockedHintTiers).toEqual([1, 2, 3]);
    expect(retrying.status).toBe("attempting");
    expect(retrying.attempts).toBe(1);
  });
});
