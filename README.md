For testing on Ropsten
var token_address = '0x7a363f7545cccb6eef863483873998e927829cda';
var faucet_address = '0xf11460CC6F049faD20fE0D7Dd00E04d822a84D8F';


faucet.sol

pragma solidity ^0.5.1;

interface ERC20 {
function transfer(address to, uint256 value) external returns (bool);
event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
uint256 constant public tokenAmount = 1000000000000000000;
uint256 constant public waitTime = 36000 minutes;

ERC20 public tokenInstance;

mapping(address => uint256) lastAccessTime;

constructor(address _tokenInstance) public {
require(_tokenInstance != address(0));
tokenInstance = ERC20(_tokenInstance);
}

function requestTokens() public {
require(allowedToWithdraw(msg.sender));
tokenInstance.transfer(msg.sender, tokenAmount);
lastAccessTime[msg.sender] = block.timestamp + waitTime;
}

function allowedToWithdraw(address _address) public view returns (bool) {
if(lastAccessTime[_address] == 0) {
return true;
} else if(block.timestamp >= lastAccessTime[_address]) {
return true;
}
return false;
}
}



SITE key  6Le-JOsaAAAAAOTq9odTJC8UsWk3ZldAxZkWjgN9
6LeYJ-saAAAAAB5u6FJZqMSeWgdCIZJB9-medWeL


Secret key 6Le-JOsaAAAAABO4nciNx2fzKyyiXWQYLnTHIWfT
6LeYJ-saAAAAAC0wybUFIltIa7ockwXsZ7l_7TH1

