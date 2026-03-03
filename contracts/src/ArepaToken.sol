// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArepaToken is ERC20, Ownable {
    // Al desplegarlo, tú serás el "owner" 
    constructor() ERC20("ArepaToken", "AREPA") Ownable(msg.sender) {
        // Se crean 1,000,000 de tokens iniciales para ti 
        _mint(msg.sender, 1_000_000 * 10**18);
    }

    // Función para que solo tú emitas más tokens si es necesario 
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}