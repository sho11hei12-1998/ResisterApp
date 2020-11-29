import React from "react";
import Resister from "./Resister.json";
import getWeb3 from "./getWeb3";
import "./App.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      name: null,
      age: null,
      hobby: null,
      address: "",
      outputName: null,
      outputAge: null,
      outputHobby: null,
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Resister.networks[networkId];
      const instance = new web3.eth.Contract(
        Resister.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }

    const { accounts } = this.state;
    console.log(accounts);
  };

  // アカウント情報の登録
  writeRecord = async () => {
    const { accounts, contract, name, age, hobby } = this.state;
    const result = await contract.methods.registerAccount(name, age, hobby).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      alert('会員登録が完了しました。');
    }
  };

  // アカウント情報の読み込み
  viewRecord = async () => {
    const { contract, accounts } = this.state;
    console.log(contract);

    const result = await contract.methods.viewAccount(accounts[0]).call();
    console.log(result);

    const outputName = result[0];
    const outputAge = result[1];
    const outputHobby = result[2];
    this.setState({ outputName, outputAge, outputHobby });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    return (
      <div className="App">
        <br />
        <form>
          <div>
            <label>氏名：</label>
            <input
              onChange={this.handleChange("name")} />
          </div>

          <div>
            <label>年齢：</label>
            <input
              onChange={this.handleChange("age")} />
          </div>

          <div>
            <label>趣味：</label>
            <input
              onChange={this.handleChange("hobby")} />
          </div>

          <button type='button' onClick={this.writeRecord}>
            会員登録
          </button>
        </form>

        <br />
        <br />

        <form>
          <label>検索したいアドレスを入力してください。</label>
          <input onChange={this.handleChange("address")} />

          <button type='button' onClick={this.viewRecord}>
            検索
            </button>
        </form>

        <br />
        <br />

        {this.state.outputName ? <p>氏名: {this.state.outputName}</p> : <p></p>}
        {this.state.outputAge ? <p>年齢: {this.state.outputAge}</p> : <p></p>}
        {this.state.outputHobby ? <p>趣味: {this.state.outputHobby}</p> : <p></p>}

      </div>

    );
  }
}

export default App;

