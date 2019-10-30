import React from "react";
import ScoreChart from "./ScoreChart";
import styled from "styled-components";

const Container = styled.div``;

function App() {
  return (
    <Container>
      <ScoreChart style={{ textAlign: "center" }} />
    </Container>
  );
}

export default App;
