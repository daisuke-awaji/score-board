import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const initData = [
  {
    time: 0,
    teamA: 30,
    teamB: 30,
    teamC: 30
  }
];

export default class ScoreChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: initData
    };

    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    setInterval(this.fetchData, 1000);
  }

  fetchData() {
    const newData = this.state.data.slice();
    newData.push({
      time: newData[newData.length - 1].time + 1,
      teamA: newData[newData.length - 1].teamA + this.rand(-10, 30),
      teamB: newData[newData.length - 1].teamB + this.rand(-10, 30),
      teamC: newData[newData.length - 1].teamC + this.rand(-10, 30)
    });
    this.setState({
      data: newData
    });
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  render() {
    return (
      <div>
        <ResponsiveContainer width="95%" height={400}>
          <LineChart
            width={1000}
            height={300}
            layout="horizontal"
            data={this.state.data}
            margin={{
              top: 10,
              right: 30,
              left: 30,
              bottom: 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" type="number" domain={[0, 100]} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="teamA" stroke="#82ca9d" />
            <Line type="monotone" dataKey="teamB" stroke="#8884d8" />
            <Line type="monotone" dataKey="teamC" stroke="#ed26a0" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
