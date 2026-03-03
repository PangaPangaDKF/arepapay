// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 10_000_000 * 10**6);
    }
    function decimals() public pure override returns (uint8) { return 6; }
    function faucet() external {
        _mint(msg.sender, 1000 * 10**6);
    }
}
