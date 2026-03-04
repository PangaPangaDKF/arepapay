// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title RewardTicket
 * @dev Contrato muy simple que actúa como “tickets” para ArepaPay.
 *      No es ERC‑721 ni ERC‑1155, solo lleva un balance por address.
 *      Sólo el PaymentProcessor (y el owner durante el setup) pueden “mint”.
 */
contract RewardTicket {
    /* -----------------------------------------------------------------------
     *  STORAGE
     * ----------------------------------------------------------------------- */
    // balances de tickets por address
    mapping(address => uint256) private _balances;

    // address que tiene permiso para crear tickets
    address public paymentProcessor;

    // owner del contrato (quien lo despliega)
    address public owner;

    /* -----------------------------------------------------------------------
     *  EVENTS
     * ----------------------------------------------------------------------- */
    event TicketMinted(address indexed to);
    event TicketBurned(address indexed from, uint256 amount);
    event PaymentProcessorSet(address indexed processor);

    /* -----------------------------------------------------------------------
     *  MODIFIERS
     * ----------------------------------------------------------------------- */
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        require(msg.sender == owner, "RewardTicket: not owner");
    }

    modifier onlyPaymentProcessor() {
        _onlyPaymentProcessor();
        _;
    }

    function _onlyPaymentProcessor() internal view {
        require(msg.sender == paymentProcessor, "RewardTicket: caller not processor");
    }

    /* -----------------------------------------------------------------------
     *  CONSTRUCTOR
     * ----------------------------------------------------------------------- */
    constructor() {
        owner = msg.sender;
    }

    /* -----------------------------------------------------------------------
     *  EXTERNAL / PUBLIC FUNCTIONS
     * ----------------------------------------------------------------------- */

    /**
     * @dev Asigna la dirección del PaymentProcessor. Sólo puede llamarse una vez
     *      por el owner; si quiere cambiarla, el owner vuelve a llamar.
     */
    function setPaymentProcessor(address _processor) external onlyOwner {
        require(_processor != address(0), "RewardTicket: zero address");
        paymentProcessor = _processor;
        emit PaymentProcessorSet(_processor);
    }

    /**
     * @dev Mint de 1 ticket al address `to`. Sólo el PaymentProcessor puede
     *      ejecutar esta función.
     */
    function mint(address to) external onlyPaymentProcessor {
        require(to != address(0), "RewardTicket: mint to zero");
        _balances[to] += 1;
        emit TicketMinted(to);
    }

    /**
     * @dev Quema `amount` tickets del address `from`. Puede ser llamado por
     *      el propio usuario (via frontend) o por el PaymentProcessor cuando
     *      sea necesario (por ejemplo, al crear una rifa).
     */
    function burn(address from, uint256 amount) external {
        require(from != address(0), "RewardTicket: burn from zero");
        require(_balances[from] >= amount, "RewardTicket: insufficient tickets");

        // Si la llamada no viene del procesador, solo el propio holder puede quemar
        if (msg.sender != paymentProcessor) {
            require(msg.sender == from, "RewardTicket: not authorized");
        }

        unchecked {
            _balances[from] = _balances[from] - amount;
        }
        emit TicketBurned(from, amount);
    }

    /**
     * @dev Devuelve cuántos tickets tiene `account`.
     */
    function balanceOf(address account) external view returns (uint256) {
        require(account != address(0), "RewardTicket: zero address");
        return _balances[account];
    }
}
