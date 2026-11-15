import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, it } from "mocha";
import type { NodeMessageInFlow } from "node-red";
import helper from "node-red-node-test-helper";
import {
  cleanupTestRuntime,
  loadTestFlow,
  startTestServer,
  type TestFlowNode,
} from "./node-red-node-test-helper-missing.ts";

import xml2jsonNode from "../lib/xml2json.js";

interface TestMessage extends NodeMessageInFlow {
  payload: string;
}

describe("xml2json Node", () => {
  before(() => {
    const require = createRequire(import.meta.url);
    const nodeRedRuntime = require.resolve("node-red");
    helper.init(nodeRedRuntime);
  });

  beforeEach(async () => {
    await startTestServer(helper);
  });

  afterEach(async () => {
    await cleanupTestRuntime(helper);
  });

  it("should be loaded", async () => {
    const flow: TestFlowNode[] = [
      {
        id: "n1",
        type: "xml2json",
        name: "xml2json",
      },
    ];

    await loadTestFlow(helper, xml2jsonNode, flow);

    const n1 = helper.getNode("n1");

    assert.equal(n1.name, "xml2json");
  });

  it("should translate payload from xml to json", async () => {
    const flow: TestFlowNode[] = [
      {
        id: "n1",
        type: "xml2json",
        name: "xml2json",
        wires: [["n2"]],
      },
      {
        id: "n2",
        type: "helper",
        name: "helper",
      },
    ];

    await loadTestFlow(helper, xml2jsonNode, flow);

    const n1 = helper.getNode("n1");
    const n2 = helper.getNode("n2");

    const messagePromise = new Promise<TestMessage>(
      (resolve) => {
        n2.once("input", (message: TestMessage) => {
          resolve(message);
        });
      },
    );

    n1.receive({
      payload: `<parent parent_property='bar'><child child_property='foo'></child></parent>`,
    });

    const message = await messagePromise;

    assert.equal(message.payload, `{"parent":{"parent_property":"bar","child":{"child_property":"foo"}}}`);
  });
});
