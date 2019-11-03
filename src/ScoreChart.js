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
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    this.subscribeData();
  }

  async subscribeData() {
    API.graphql(graphqlOperation(onCreatePoint)).subscribe({
      next: eventData => {
        const point = eventData.value.data.onCreatePoint;
        console.log("eventData.value.data.onCreatePoint: ", point);
        const tmp = this.state.data.slice();
        tmp.push(point);
        this.setState({
          data: tmp
        });
      }
    });
  }

  async fetchData() {
    try {
      const points = await API.graphql(graphqlOperation(listPoints));
      console.log(points.data.listPoints.items);
      const items = points.data.listPoints.items;
      items.sort((a, b) => {
        if (a.createdAt > b.createdAt) return 1;
        if (a.createdAt < b.createdAt) return -1;
        return 0;
      });
      this.setState({
        data: items
      });
    } catch (e) {
      console.log(e);
    }
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
            <XAxis dataKey="createdAt" type="category" domain={[0, 100]} />
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
