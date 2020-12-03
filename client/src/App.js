import React from "react";
import Resister from "./Resister.json";
import getWeb3 from "./getWeb3";

import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

      ////
      lines: [],

      // モーダル
      show: false,
      // フォームチェック
      validated: false,
    };
  }

  // モーダル設定
  handleClose = async () => {
    await this.setState({ show: false });

    // ページリロード
    document.location.reload();
  }

  handleShow = async () => this.setState({ show: true });

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

    const { accounts, contract } = this.state;
    console.log(accounts);

    const item = await contract.methods.accounts(accounts[0]).call();
    this.state.lines.push({
      item
    });

    console.log(this.state.lines);
  };

  // アカウント情報の登録
  writeRecord = async () => {
    const { accounts, contract, name, age, hobby } = this.state;
    const result = await contract.methods.registerAccount(name, age, hobby).send({
      from: accounts[0],
    });
    console.log(result);

    if (result.status === true) {
      this.handleShow();
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

  // フォーム最終確認
  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  };


  render() {
    return (
      <div className="App">
        <Row className="text-left m-5">
          <Col md={{ span: 4, offset: 2 }}>
            <Form className="justify-content-center"
              noValidate validated={this.state.validated} >

              <Form.Group controlId="validationCustom03">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  onChange={this.handleChange("name")}
                  placeholder="Enter Name"
                  required />
                <Form.Control.Feedback type="invalid">
                  Please enter name.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom03">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleChange("age")}
                  placeholder="Enter Age"
                  required />
                <Form.Text className="text-muted">
                  We'll never share your age with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please enter age.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="validationCustom03">
                <Form.Label>Hobby</Form.Label>
                <Form.Control
                  type="text"
                  onChange={this.handleChange("hobby")}
                  placeholder="Enter Hobby"
                  required />
                <Form.Control.Feedback type="invalid">
                  Please enter hobby.
                </Form.Control.Feedback>
              </Form.Group>

              {/* フォームチェック */}
              <Form.Group>
                <Form.Check
                  required
                  label="Agree to terms and conditions"
                  feedback="You must agree before submitting."
                  onChange={this.handleSubmit}
                />
              </Form.Group>

              <Button variant="primary" type="button" onClick={this.writeRecord}>
                会員登録
              </Button>

              {/* モーダル */}
              <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Wellcome to BcDiary!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>会員登録が完了しました。</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Form>
          </Col>

          <Col md={{ span: 4, offset: 0 }} className='ml-5'>
            <Form className="justify-content-center">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>検索したいアドレスを入力してください。</Form.Label>
                <Form.Control onChange={this.handleChange("address")}
                  placeholder="Search" />
              </Form.Group>
              <Button variant="primary" type="button" onClick={this.viewRecord}>
                閲覧
          </Button>
            </Form>

            <br />
            <br />

            {this.state.outputName ? <p>Name: {this.state.outputName}</p> : <p></p>}
            {this.state.outputAge ? <p>Age: {this.state.outputAge}</p> : <p></p>}
            {this.state.outputHobby ? <p>Hobby: {this.state.outputHobby}</p> : <p></p>}

          </Col>
        </Row>
      </div >
    );
  }
}

export default App;
