pragma solidity ^0.4.17;

contract Lottery{
    address public  manager;
    address[] public players;
    address public lastwinner;
    
    function Lottery() public{
        manager=msg.sender;
        lastwinner=manager;
    }
    
    function enter() public payable{
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }
    function getplayers() public view returns(address[]){
        return players;
    }
    function total() public view returns(uint256){
        return players.length;
    }
    function random() private view returns(uint){
        return uint(keccak256(block.difficulty,now,players));
    }
    function pickWinner() public restricted {
        uint index=random()%total();
        players[index].transfer(this.balance);
        lastwinner=players[index];
        players=new address[](0);
    }
    function currentBalance() public view returns(uint){
        return this.balance;
    }
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
}






