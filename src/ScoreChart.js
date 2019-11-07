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
import { API, graphqlOperation } from "aws-amplify";
import { listPoints } from "./graphql/queries";
import { onCreatePoint } from "./graphql/subscriptions";

export default class ScoreChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // expected [{teamA: 10, teamB: 20, createdAt: 2019-11-07T15:40:51.155Z}, ...]
      dataKey: [] // expected [teamA", "teamB", ...]
    };
    this.strokeColors = [
      "#82ca9d",
      "#8884d8",
      "#ed26a0",
      "#281e1e",
      "#98fb98",
      "#cfcf3f",
      "#313125"
    ];
    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    this.subscribeData();
  }

  async subscribeData() {
    API.graphql(graphqlOperation(onCreatePoint)).subscribe({
      next: eventData => {
        const data = this.state.data.slice();
        const item = eventData.value.data.onCreatePoint;
        console.log("eventData.value.data.onCreatePoint: ", item);
        const json = JSON.parse(item.points);
        json["createdAt"] = item.createdAt;
        data.push(json);
        this.setState({
          data: data
        });
      }
    });
  }

  async fetchData() {
    try {
      const points = await API.graphql(graphqlOperation(listPoints));
      const items = points.data.listPoints.items;
      items.sort((a, b) => {
        if (a.createdAt > b.createdAt) return 1;
        if (a.createdAt < b.createdAt) return -1;
        return 0;
      });
      const data = [];
      items.map(item => {
        const json = JSON.parse(item.points);
        this.setState({ dataKey: Object.keys(json) });
        json["createdAt"] = item.createdAt;
        return data.push(json);
      });
      this.setState({
        data: data
      });
    } catch (e) {
      console.log(e);
    }
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  render() {
    const LineList = this.state.dataKey.map((key, index) => {
      return (
        <Line
          type="monotone"
          strokeWidth="[{ x: 24, y: 24, value: 480 }]"
          dataKey={key.toString()}
          stroke={this.strokeColors[index]}
          key={index}
        />
      );
    });
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
            <XAxis dataKey="createdAt" type="category" domain={[0, 100]} />
            <YAxis />
            <Tooltip />
            <Legend />
            {LineList}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
