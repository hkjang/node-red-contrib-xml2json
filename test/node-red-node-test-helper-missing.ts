// Really these are things that are missing from node-red-node-test-helper.

import nodeRedNodeTestHelper from "node-red-node-test-helper";

export interface TestFlowNode {
  id: string;
  type: string;
  name: string;
  wires?: string[][];
}

export function startTestServer(
  testHelper: typeof nodeRedNodeTestHelper,
): Promise<void> {
  return new Promise<void>(function (resolve) {
    testHelper.startServer(resolve);
  });
}

export async function cleanupTestRuntime(
  testHelper: typeof nodeRedNodeTestHelper,
): Promise<void> {
  testHelper.unload();

  await new Promise<void>(function (resolve) {
    testHelper.stopServer(resolve);
  });
}

export async function loadTestFlow(
  testHelper: typeof nodeRedNodeTestHelper,
  testNode: nodeRedNodeTestHelper.TestNodeInitializer,
  testFlow: TestFlowNode[],
) {
  await new Promise<void>((resolve) => {
    testHelper.load(testNode, testFlow, resolve);
  });
}
