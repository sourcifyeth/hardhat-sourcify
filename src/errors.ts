import { NomicLabsHardhatPluginError } from "hardhat/plugins";

export class HardhatEtherscanError extends NomicLabsHardhatPluginError {
  constructor(message: string, parent?: Error) {
    super("@nomicfoundation/hardhat-verify", message, parent);
  }
}

export class ContractVerificationRequestError extends HardhatEtherscanError {
  constructor(url: string, parent: Error) {
    super(
      `Failed to send contract verification request.
Endpoint URL: ${url}
Reason: ${parent.message}`,
      parent
    );
  }
}

export class ContractVerificationInvalidStatusCodeError extends HardhatEtherscanError {
  constructor(url: string, statusCode: number, responseText: string) {
    super(`Failed to send contract verification request.
Endpoint URL: ${url}
The HTTP server response is not ok. Status code: ${statusCode} Response text: ${responseText}`);
  }
}

export class ContractNotFoundError extends HardhatEtherscanError {
  constructor(contractFQN: string) {
    super(`The contract ${contractFQN} is not present in your project.`);
  }
}

export class ContractVerificationFailedError extends HardhatEtherscanError {
  constructor(message: string, undetectableLibraries: string[]) {
    super(`The contract verification failed.
Reason: ${message}
${
  undetectableLibraries.length > 0
    ? `
This contract makes use of libraries whose addresses are undetectable by the plugin.
Keep in mind that this verification failure may be due to passing in the wrong
address for one of these libraries:
${undetectableLibraries.map((x) => `  * ${x}`).join("\n")}`
    : ""
}`);
  }
}

export class BuildInfoNotFoundError extends HardhatEtherscanError {
  constructor(contractFQN: string) {
    super(`The contract ${contractFQN} is present in your project, but we couldn't find its sources.
Please make sure that it has been compiled by Hardhat and that it is written in Solidity.`);
  }
}

export class VerificationAPIUnexpectedMessageError extends HardhatEtherscanError {
  constructor(message: string) {
    super(`The API responded with an unexpected message.
Please report this issue to the Hardhat team.
Contract verification may have succeeded and should be checked manually.
Message: ${message}`);
  }
}
