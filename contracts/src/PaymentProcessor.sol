// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MerchantRegistry.sol";

contract PaymentProcessor is Ownable {
    MerchantRegistry public registry;
    IERC20 public usdt;

    event PaymentSent(address indexed from, address indexed to, uint256 amount);

    constructor(address _registry, address _usdt) Ownable(msg.sender) {
        registry = MerchantRegistry(_registry);
        usdt = IERC20(_usdt);
    }

    function payMerchant(address _merchant, uint256 _amount) external {
        // 1. Verificar que el comercio esté registrado y verificado por TI
        require(registry.isMerchant(_merchant), "Comercio no verificado en ArepaPay");
        
        // 2. Transferir USDT del usuario al comercio
        require(usdt.transferFrom(msg.sender, _merchant, _amount), "Fallo en la transferencia");

        emit PaymentSent(msg.sender, _merchant, _amount);
    }

    // Función para actualizar el registro si decides cambiarlo en el futuro
    function updateRegistry(address _newRegistry) external onlyOwner {
        registry = MerchantRegistry(_newRegistry);
    }
}
