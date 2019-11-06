import React from "react";
import { Row, Col, Button, Card, Alert } from "antd";
// import { Bar, Line } from "react-chartjs-2";
// import Login from "./Login.js";
// import FormInputs from "./FormInputs.js";
// import Validation from "./Validation.js";

class UIKit extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <h1>Welcome to BitCar</h1>
          <h4>
            Historically the ownership of rare and exotic hyper and super cars
            (known as 'Exotics') and classic cars have been limited to the very
            wealthy, until now.
            <br />
            BitCar opens up the Exotics asset class to everyone in the world,
            allowing anyone to purchase an interest and trade in different
            Exotic cars.
          </h4>
          <br />
        </Row>
        <Row>
          <h1>Typography</h1>
          <h1>h1</h1>
          <h2>h2</h2>
          <h3>h3</h3>
          <h4>h4</h4>
          <p>p</p>
        </Row>
        <br />
        <Row gutter={10}>
          <Col span={6}>
            <Alert message="Success Text" type="success" showIcon />
          </Col>
          <Col span={6}>
            <Alert message="Info Text" type="info" showIcon />
          </Col>
          <Col span={6}>
            <Alert message="Warning Text" type="warning" showIcon />
          </Col>
          <Col span={6}>
            <Alert message="Error Text" type="error" showIcon />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={24} lg={12} xl={6}>
            <Card className="dash-stat-card" bordered={false}>
              <h2>Card One</h2>
              <p>Statistic 1</p>
              <Button
                style={{ float: "right", bottom: "40px", position: "relative" }}
                ghost
              >
                See Details
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={12} xl={6}>
            <Card className="dash-stat-card" bordered={false}>
              <h2>Card Two</h2>
              <p>Statistic 2</p>
              <Button
                style={{ float: "right", bottom: "40px", position: "relative" }}
                ghost
              >
                See Details
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={12} xl={6}>
            <Card className="dash-stat-card" bordered={false}>
              <h2>Card Three</h2>
              <p>Statistic 3</p>
              <Button
                style={{ float: "right", bottom: "40px", position: "relative" }}
                ghost
              >
                See Details
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={12} xl={6}>
            <Card className="dash-stat-card" bordered={false}>
              <Button style={{ margin: 5, width: 100 }}>Default</Button>
              <Button
                style={{ margin: 5, width: 100 }}
                className="btn-secondary"
              >
                Secondary
              </Button>
              <Button style={{ margin: 5, width: 100 }} className="btn-danger">
                Danger
              </Button>
              <Button style={{ margin: 5, width: 100 }} className="btn-success">
                Success
              </Button>
              <Button style={{ margin: 5, width: 100 }} className="btn-info">
                Info
              </Button>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col span={8}>
            <Card className="dash-stat-card" bordered={false}>
              {/* <Login /> */}
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dash-stat-card" bordered={false}>
              {/* <FormInputs /> */}
            </Card>
          </Col>
          <Col span={8}>
            <Card className="dash-stat-card" bordered={false}>
              {/* <Validation /> */}
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={12}>
            {/* <Bar
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July"
                ],
                datasets: [
                  {
                    label: "Bar dataset",
                    backgroundColor: "#f6a821",
                    borderColor: "#f6a821",
                    data: [0, 10, 5, 2, 20, 30, 45]
                  }
                ]
              }}
            /> */}
          </Col>
          <Col span={12}>
            {/* <Line
              data={{
                labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July"
                ],
                datasets: [
                  {
                    label: "Line dataset",
                    borderColor: "#f6a821",
                    data: [0, 10, 5, 2, 20, 30, 45]
                  }
                ]
              }}
            /> */}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default UIKit;
