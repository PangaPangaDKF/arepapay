// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "forge-std/Script.sol";
import "src/ArepaToken.sol";
import "src/MockUSDT.sol";
import "src/MerchantRegistry.sol";
import "src/PaymentProcessor.sol";
import "src/LiquidityManager.sol";
import "src/RewardNFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ArepaToken arepa = new ArepaToken();
        MockUSDT usdt = new MockUSDT();
        MerchantRegistry registry = new MerchantRegistry();
        RewardNFT nft = new RewardNFT();
        
        // Desplegamos los que dependen de otros
        new PaymentProcessor(address(registry), address(usdt));
        new LiquidityManager(address(usdt));

        vm.stopBroadcast();
    }
}
