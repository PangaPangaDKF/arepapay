// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityManager is Ownable {
    IERC20 public usdt;
    event LiquidityAdded(uint256 amount);
    constructor(address _usdt) Ownable(msg.sender) { usdt = IERC20(_usdt); }
    function addLiquidity(uint256 _amount) external onlyOwner {
        require(usdt.transferFrom(msg.sender, address(this), _amount), "Fallo al agregar liquidez");
        emit LiquidityAdded(_amount);
    }
}
