import React, { Component } from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

class App extends Component {
  // web3.eth.getAccounts().then(console.log);
  state = {
    manager: "",
    players: [],
    balance: "",
    value:"",
    message:"",
    // lastwinner : ""

  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getplayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    // const lastwinner = await lottery.methods.lastwinner().call();
    

    this.setState({
      manager,
      players,
      balance,
      // lastwinner
      
    });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts =await web3.eth.getAccounts();

    this.setState({message:'Waiting  on transaction Success....'});

    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    })

    this.setState({message:"You have been entered !!"});

  }

  onClick = async (event)=>{
    const accounts =await web3.eth.getAccounts();

    this.setState({message:'Waiting  on transaction Success....'});

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    })

    // let val= await lottery.methods.lastwinner().call();
    // console.log(val);
    // this.setState({lastwinner: val});
    this.setState({message:'A Winner has been picked ! '});

  }

  render() {
    return (
      <div>
        <h1> Lottery Contract </h1>
        <p>
          {" "}
          This Contract is Managed By {this.state.manager}. Their are currently{" "}
          {this.state.players.length} people entered, competing to win  {" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether.
        </p>
        <hr/>
        <form onSubmit={ this.onSubmit}> 
          <h3>Want to try your Luck???</h3>
          <div>
            <label>Amount of ether to enter :</label>
            <input  
            value={this.state.value}
              onChange={event => this. setState({value:event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr/>

        <h2>Ready to pick a winner?</h2>
        <button onClick={this.onClick}> Pick a  Winner!</button>
        

        <hr/>

        <h1>{this.state.message}</h1>
        {/* {this.state.lastwinner} */}

      </div>
    );
  }
}

export default App;
