const assert = require("assert");
const ganache =require("ganache-cli");
const Web3 =require('web3'); 

const provider=ganache.provider();
const web3 = new Web3(provider);


const { interface ,bytecode}=require('../compile')


let accounts;
let lottery;

beforeEach( async ()=>{
    //get a list of all accounts
    accounts=await web3.eth.getAccounts();
    // .then(fetchedAccounts => {
    //     console.log(fetchedAccounts);
    // })
    //use one of those account to deploy the contract
    lottery= await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode})
        .send({from: accounts[0] , gas: '1000000'});

    lottery.setProvider(provider);
})

describe("Lottery Contract",() =>{
    it('deploys a contract',() => {
        assert.ok(lottery.options.address);
    });

    it("allow one user to enter",async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value:web3.utils.toWei('0.02', 'ether')
        });

        const players= await lottery.methods.getplayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length)

    });

    it("allow multiple user to enter",async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value:web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value:web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value:web3.utils.toWei('0.02', 'ether')
        });

        const players= await lottery.methods.getplayers().call({
            from: accounts[0]
        })
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length)

    })

    it("require minimum amount of ether", async() => {
        try{
            await lottery.methods.enter().send({
                from : accounts[0],
                value: 200
            })
            console.log()
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    it("only manager can pick winner", async() => {
        try{
            await lottery.methods.enter().send({
                from : accounts[1],
                value: web3.eth.toWei('2', "ether")
            })

            await lottery.methods.pickWinner().send({
                from : accounts[1],
            })
            console.log("here we go")
            assert(false);
        }catch(err){
            assert(err);
        }
    });

    
    it("sends money to winner and reset players array",async() =>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('2','ether')
        });

        const initialbalance=await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from : accounts[0]});

        const finalbalance= await web3.eth.getBalance(accounts[0]);

        assert(finalbalance > initialbalance);

        const people= await lottery.methods.getplayers().call({
            from: accounts[0]
        });
        assert.equal(0,people.length);

    })


});








