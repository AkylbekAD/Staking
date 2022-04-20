//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is Ownable, AccessControl {
    uint public rewardPercent = 20;
    uint public stakeTime = 20 minutes;
    address public QuokkaTokenAddress;
    address public UNIV2Address; 
    bytes32 public constant CHANGER_ROLE = keccak256("CHANGER_ROLE");

    struct provider {
        uint stakedTokens;
        uint rewardTokens;
        uint freezeTime;
    }

    mapping (address => provider) public stakingProviders;

    constructor (address rewardToken, address lpToken) {
        QuokkaTokenAddress = rewardToken;
        UNIV2Address = lpToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(CHANGER_ROLE, msg.sender);
    }
    
    function stake(uint256 amount) external {
        IERC20(UNIV2Address).transferFrom(msg.sender, address(this), amount);
        stakingProviders[msg.sender].stakedTokens = amount;
        stakingProviders[msg.sender].freezeTime = block.timestamp + stakeTime;
        stakingProviders[msg.sender].rewardTokens = amount * rewardPercent / 100;
    }

    function claim() external isTimePassed {
        uint reward = stakingProviders[msg.sender].rewardTokens;
        stakingProviders[msg.sender].rewardTokens = 0;
        IERC20(QuokkaTokenAddress).transfer(msg.sender, reward);
    }

    function unstake() external isTimePassed {
        uint LPTokens = stakingProviders[msg.sender].stakedTokens;
        stakingProviders[msg.sender].stakedTokens = 0;
        IERC20(UNIV2Address).transfer(msg.sender, LPTokens);
    }

    modifier isTimePassed () {
        require(stakingProviders[msg.sender].freezeTime <= block.timestamp, "Stake time have not pass yet");
        _;
    }

    function changeStakeTime (uint newTime) external isChanger {
        stakeTime = newTime;
    }

    function changeRewardPercent (uint newPercent) external isChanger{
        rewardPercent = newPercent;
    }

    function giveChangerRights (address newChanger) external onlyOwner {
        _grantRole(CHANGER_ROLE, newChanger);
    }

    function revokeChangerRights (address newChanger) external onlyOwner {
        _revokeRole(CHANGER_ROLE, newChanger);
    }

    modifier isChanger () {
        require(hasRole(CHANGER_ROLE, msg.sender), "You dont have rights to change it");
        _;
    }
}