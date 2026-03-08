// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19 ^0.8.20;

// lib/openzeppelin-contracts/contracts/utils/Context.sol

// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// lib/openzeppelin-contracts/contracts/access/Ownable.sol

// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// src/InternetVoucher.sol

/**
 * @title InternetVoucher
 * @dev Minutos de internet ganados al pagar en comercios ArepaPay.
 *
 * Flujo:
 *   1. PaymentProcessor llama mint(usuario, minutos) al procesar un pago.
 *   2. El usuario llama activate(minutos) para quemar sus minutos y activar acceso.
 *      Emite ActivationRequested — un router MikroTik autorizado puede escuchar este evento
 *      y abrir el portal cautivo en tiempo real.
 *   3. Para integracion real con routers: authorizeConsumer(router) + consume(user, minutes).
 */
contract InternetVoucher is Ownable {
    mapping(address => uint256) private _balance;   // minutos disponibles

    address public paymentProcessor;
    uint256 public minutesPerPayment = 30;          // configurable por el owner

    // Consumidores autorizados (routers MikroTik, backend del hotspot)
    mapping(address => bool) public authorizedConsumers;

    /* -----------------------------------------------------------------------
     *  EVENTS
     * ----------------------------------------------------------------------- */
    event MinutesMinted(address indexed to, uint256 amount);
    event ActivationRequested(address indexed user, uint256 amount, uint256 timestamp);
    event MinutesConsumed(address indexed user, uint256 amount, address indexed consumer);
    event PaymentProcessorSet(address indexed processor);
    event ConsumerAuthorized(address indexed consumer, bool authorized);

    /* -----------------------------------------------------------------------
     *  CONSTRUCTOR
     * ----------------------------------------------------------------------- */
    constructor() Ownable(msg.sender) {}

    /* -----------------------------------------------------------------------
     *  CONFIGURACION (owner)
     * ----------------------------------------------------------------------- */
    function setPaymentProcessor(address _processor) external onlyOwner {
        require(_processor != address(0), "IV: zero address");
        paymentProcessor = _processor;
        emit PaymentProcessorSet(_processor);
    }

    function setMinutesPerPayment(uint256 _minutes) external onlyOwner {
        require(_minutes > 0, "IV: must be > 0");
        minutesPerPayment = _minutes;
    }

    function setConsumer(address _consumer, bool _authorized) external onlyOwner {
        authorizedConsumers[_consumer] = _authorized;
        emit ConsumerAuthorized(_consumer, _authorized);
    }

    /* -----------------------------------------------------------------------
     *  MINT — solo PaymentProcessor
     * ----------------------------------------------------------------------- */
    function mint(address to, uint256 minutes_) external {
        require(msg.sender == paymentProcessor, "IV: not authorized");
        require(to != address(0), "IV: zero address");
        _balance[to] += minutes_;
        emit MinutesMinted(to, minutes_);
    }

    /* -----------------------------------------------------------------------
     *  ACTIVATE — el usuario quema sus minutos y pide activacion
     *  El evento ActivationRequested puede ser escuchado por un backend/router
     * ----------------------------------------------------------------------- */
    function activate(uint256 minutes_) external {
        require(_balance[msg.sender] >= minutes_, "IV: saldo insuficiente");
        require(minutes_ > 0, "IV: minutos must be > 0");
        _balance[msg.sender] -= minutes_;
        emit ActivationRequested(msg.sender, minutes_, block.timestamp);
    }

    /* -----------------------------------------------------------------------
     *  CONSUME — para integracion con router real (MikroTik, UniFi, etc.)
     * ----------------------------------------------------------------------- */
    function consume(address user, uint256 minutes_) external {
        require(authorizedConsumers[msg.sender], "IV: consumer not authorized");
        require(_balance[user] >= minutes_, "IV: saldo insuficiente");
        _balance[user] -= minutes_;
        emit MinutesConsumed(user, minutes_, msg.sender);
    }

    /* -----------------------------------------------------------------------
     *  VIEW
     * ----------------------------------------------------------------------- */
    function balanceOf(address user) external view returns (uint256) {
        return _balance[user];
    }
}

