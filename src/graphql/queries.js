// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPoint = `query GetPoint($id: ID!) {
  getPoint(id: $id) {
    id
    teamA
    teamB
    teamC
    createdAt
  }
}
`;
export const listPoints = `query ListPoints(
  $filter: ModelPointFilterInput
  $limit: Int
  $nextToken: String
) {
  listPoints(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      teamA
      teamB
      teamC
      createdAt
    }
    nextToken
  }
}
`;
