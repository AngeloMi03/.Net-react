import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default function ServerError() {
  const { commonStore } = useStore();
  return (
    <Container>
      <Header as="h1" content="Server Error" color="red" />
      <Header sub as="h5" content={commonStore.error?.message} color="red" />
      {commonStore.error?.details && (
        <Segment>
          <Header as="h4" content="Stack Trace" color="teal" />
          <code style={{ marginTop: "10px" }}>
            {commonStore.error?.details}
          </code>
        </Segment>
      )}
    </Container>
  );
}
