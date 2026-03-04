// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC20 }   from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev ERC20 simple que simula USDT en la subnet local.
 *      El deployer recibe todo el suministro inicial.
 */
contract MockUSDT is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18; // 1M USDT

    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Permite al owner “mintear” tokens para pruebas.
     */
    function faucet(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
