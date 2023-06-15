import sinon from "sinon";
import { assert, expect } from "chai";
import { TASK_CLEAN, TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { TASK_VERIFY_SOURCIFY } from "../../src/task-names";
import { deployContract, getRandomAddress, useEnvironment } from "../helpers";

import {
  interceptSourcifyIsVerified,
  interceptSourcifyVerify,
  mockEnvironmentSourcify,
} from "./mocks/sourcify";

describe("verify task integration tests", () => {
  useEnvironment("hardhat-project");
  mockEnvironmentSourcify();

  describe("with a non-verified contract", () => {
    let simpleContractAddress: string;
    let duplicatedContractAddress: string;
    let normalLibAddress: string;
    let constructorLibAddress: string;
    let onlyNormalLibContractAddress: string;
    let bothLibsContractAddress: string;

    before(async function () {
      await this.hre.run(TASK_COMPILE, { force: true, quiet: true });
      simpleContractAddress = await deployContract(
        "SimpleContract",
        [],
        this.hre
      );
    });

    it.only("should verify a contract on Sourcify", async function () {
      interceptSourcifyIsVerified([
        { address: simpleContractAddress, status: "false" },
      ]);
      interceptSourcifyVerify({
        result: [
          {
            address: simpleContractAddress,
            status: "perfect",
          },
        ],
      });
      const logStub = sinon.stub(console, "log");

      const taskResponse = await this.hre.run(TASK_VERIFY_SOURCIFY, {
        address: simpleContractAddress,
        contractFQN: "contracts/SimpleContract.sol:SimpleContract",
      });

      assert.equal(logStub.callCount, 1);
      (expect(logStub.getCall(0)).to.be as any)
        .calledWith(`Successfully verified contract SimpleContract on Sourcify.
https://repo.sourcify.dev/contracts/full_match/31337/${simpleContractAddress}/`);
      logStub.restore();
      assert.isUndefined(taskResponse);
    });

    after(async function () {
      await this.hre.run(TASK_CLEAN);
    });
  });
});
