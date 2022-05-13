//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    uint public percentDecimals = 3;
    uint public rewardPercent = 20000;
    uint public claimTime = 20 minutes;
    uint public unstakeTime = 40 minutes;
    address public QuokkaTokenAddress;
    address public UNIV2Address; 
    bytes32 public constant CHANGER_ROLE = keccak256("CHANGER_ROLE");
    bytes32 public constant ADMIN = keccak256("ADMIN");

    struct provider {
        uint stakedTokens;
        uint claimTime;
        uint unstakeTime;
    }

    mapping (address => provider) public stakingProviders;

    event Staked(address depositor, uint256 amount);
    event Claimed(address depositor, uint256 reward);
    event Unstaked(address depositor, uint256 amount);

    constructor (address rewardToken, address lpToken) {
        QuokkaTokenAddress = rewardToken;
        UNIV2Address = lpToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN, msg.sender);
        _setupRole(CHANGER_ROLE, msg.sender);
    }
    
    function stake(uint256 amount) external {
        require(amount >= 100**percentDecimals, "You have to stake atleast 0.00001 of UNI-V2");
        IERC20(UNIV2Address).transferFrom(msg.sender, address(this), amount);
        stakingProviders[msg.sender].stakedTokens = amount;
        stakingProviders[msg.sender].claimTime = block.timestamp + claimTime;
        stakingProviders[msg.sender].unstakeTime = block.timestamp + unstakeTime;

        emit Staked(msg.sender, amount);
    }

    function claim() external {
        require(stakingProviders[msg.sender].claimTime <= block.timestamp, "Claim time have not pass yet");

        uint256 reward = (stakingProviders[msg.sender].stakedTokens * rewardPercent) / (100 * 10 ** percentDecimals);

        IERC20(QuokkaTokenAddress).transfer(msg.sender, reward);

        emit Claimed(msg.sender, reward);
    }

    function unstake() external {
        require(stakingProviders[msg.sender].unstakeTime <= block.timestamp, "Unstake time have not pass yet");

        uint LPTokens = stakingProviders[msg.sender].stakedTokens;
        stakingProviders[msg.sender].stakedTokens = 0;
        IERC20(UNIV2Address).transfer(msg.sender, LPTokens);

        emit Unstaked(msg.sender, LPTokens);
    }

    function changeClaimTime (uint newTime) external isChanger {
        claimTime = newTime;
    }

    function changeUnstakeTime (uint newTime) external isChanger {
        unstakeTime = newTime;
    }

    function changeRewardPercent (uint newPercent) external isChanger{
        rewardPercent = newPercent;
    }

    function giveChangerRights (address newChanger) external {
        require(hasRole(ADMIN, msg.sender), "You dont have rights to change it");
        _grantRole(CHANGER_ROLE, newChanger);
    }

    function revokeChangerRights (address newChanger) external {
        require(hasRole(ADMIN, msg.sender), "You dont have rights to change it");
        _revokeRole(CHANGER_ROLE, newChanger);
    }

    modifier isChanger () {
        require(hasRole(CHANGER_ROLE, msg.sender), "You dont have rights to change it");
        _;
    }
}