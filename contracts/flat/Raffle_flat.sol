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

// src/Raffle.sol

interface IRewardTicket {
    function burn(address from, uint256 amount) external;
}

/**
 * @title Raffle
 * @dev Cada N pagos a comercios se abre una rifa con 3 ganadores.
 *      Los usuarios entran quemando tickets (mas tickets = mas chance).
 *      Seleccion ponderada sin reemplazo: cada ganador se excluye antes del siguiente sorteo.
 *      El owner sortea con draw(). Los premios son fisicos.
 */
contract Raffle is Ownable {
    IRewardTicket public ticket;
    address public paymentProcessor;

    uint256 public txCount;
    uint256 public txThreshold = 10;
    uint256 public currentRound;
    bool    public isOpen;

    uint256 public constant MAX_WINNERS = 3;

    struct Round {
        string   prize;
        uint256  totalStaked;
        address[] participants;
        address[3] winners;
        uint256  winnersCount;   // cuantos ganadores se eligieron (min(3, participants))
        bool     drawn;
    }

    mapping(uint256 => Round)                       private _rounds;
    mapping(uint256 => mapping(address => uint256)) public  stakes;

    /* -----------------------------------------------------------------------
     *  EVENTS
     * ----------------------------------------------------------------------- */
    event RaffleOpened(uint256 indexed round, string prize);
    event TicketsStaked(uint256 indexed round, address indexed user, uint256 amount);
    event RaffleDrawn(uint256 indexed round, address[3] winners, uint256 winnersCount);
    event TransactionRecorded(uint256 indexed txCount);

    /* -----------------------------------------------------------------------
     *  CONSTRUCTOR
     * ----------------------------------------------------------------------- */
    constructor(address _ticket) Ownable(msg.sender) {
        ticket = IRewardTicket(_ticket);
    }

    /* -----------------------------------------------------------------------
     *  CONFIGURACION (owner)
     * ----------------------------------------------------------------------- */
    function setPaymentProcessor(address _processor) external onlyOwner {
        paymentProcessor = _processor;
    }

    function setThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold > 0, "Raffle: threshold must be > 0");
        txThreshold = _threshold;
    }

    /* -----------------------------------------------------------------------
     *  REGISTRO DE PAGOS (llamado por PaymentProcessor)
     * ----------------------------------------------------------------------- */
    function recordTransaction() external {
        require(msg.sender == paymentProcessor, "Raffle: not authorized");
        txCount++;
        emit TransactionRecorded(txCount);

        if (txCount % txThreshold == 0 && !isOpen) {
            currentRound++;
            isOpen = true;
            _rounds[currentRound].prize = "3 Helados Coco";
            emit RaffleOpened(currentRound, "3 Helados Coco");
        }
    }

    /* -----------------------------------------------------------------------
     *  PARTICIPAR EN LA RIFA
     * ----------------------------------------------------------------------- */
    function enter(uint256 amount) external {
        require(isOpen, "Raffle: no hay rifa activa");
        require(amount >= 1, "Raffle: minimo 1 ticket");

        Round storage r = _rounds[currentRound];
        require(!r.drawn, "Raffle: ya fue sorteada");

        if (stakes[currentRound][msg.sender] == 0) {
            r.participants.push(msg.sender);
        }

        ticket.burn(msg.sender, amount);

        stakes[currentRound][msg.sender] += amount;
        r.totalStaked += amount;

        emit TicketsStaked(currentRound, msg.sender, amount);
    }

    /* -----------------------------------------------------------------------
     *  SORTEO — 3 ganadores ponderados sin reemplazo (owner)
     * ----------------------------------------------------------------------- */
    function draw() external onlyOwner {
        require(isOpen, "Raffle: no hay rifa activa");
        Round storage r = _rounds[currentRound];
        require(!r.drawn, "Raffle: ya fue sorteada");
        require(r.participants.length > 0, "Raffle: sin participantes");

        uint256 n = r.participants.length;

        // Copia temporal de stakes para poder excluir ganadores sin modificar el storage
        uint256[] memory tempStakes = new uint256[](n);
        uint256 tempTotal = r.totalStaked;
        for (uint256 i = 0; i < n; i++) {
            tempStakes[i] = stakes[currentRound][r.participants[i]];
        }

        // Elegir hasta 3 ganadores unicos
        uint256 numWinners = n < MAX_WINNERS ? n : MAX_WINNERS;

        for (uint256 w = 0; w < numWinners; w++) {
            uint256 seed = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                tempTotal,
                currentRound,
                w,
                r.participants.length
            )));

            uint256 target     = seed % tempTotal;
            uint256 cumulative = 0;

            for (uint256 i = 0; i < n; i++) {
                if (tempStakes[i] == 0) continue; // ya gano
                cumulative += tempStakes[i];
                if (cumulative > target) {
                    r.winners[w] = r.participants[i];
                    tempTotal   -= tempStakes[i];
                    tempStakes[i] = 0;
                    break;
                }
            }
        }

        r.winnersCount = numWinners;
        r.drawn  = true;
        isOpen   = false;

        emit RaffleDrawn(currentRound, r.winners, numWinners);
    }

    /* -----------------------------------------------------------------------
     *  VIEWS
     * ----------------------------------------------------------------------- */
    function getRaffleState() external view returns (
        uint256  _txCount,
        uint256  _txThreshold,
        uint256  _currentRound,
        bool     _isOpen,
        uint256  totalStaked,
        uint256  participantCount,
        address[3] memory winners,
        uint256  winnersCount,
        bool     drawn,
        string   memory prize
    ) {
        Round storage r = _rounds[currentRound];
        return (
            txCount,
            txThreshold,
            currentRound,
            isOpen,
            r.totalStaked,
            r.participants.length,
            r.winners,
            r.winnersCount,
            r.drawn,
            r.prize
        );
    }

    function myStake(address user) external view returns (uint256) {
        return stakes[currentRound][user];
    }
}

