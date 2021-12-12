import Button from '@restart/ui/esm/Button';
import React, {FC, MouseEventHandler, PropsWithChildren, useEffect, useState} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import AddParticipant from './AddParticipant';
import CountdownTimer from './CoundownTimer';

interface Message {
  message: string;
  status: "success" | "failure";
};

interface Participant {
  name: string;
};

type Fetch<A> = (signal: AbortSignal) => Promise<A>;

const deleteParticipant = async (participant: Participant) => {
  const response = await fetch("/santa/api/participants", {
    body: JSON.stringify(participant),
    headers: {
      'Content-Type': 'application/json'
    },
    method: "DELETE",
  });
  return await response.json() as Message;
};

const fetchCutoffTime: Fetch<Date> = async (signal) => {
  const response = await fetch("/santa/api/cutoff", {signal});
  return new Date(await response.text());
};

const fetchParticipants: Fetch<Participant[]> = async (signal) => {
  const response = await fetch("/santa/api/participants", {signal});
  return await response.json();
};

const fetchResult: (signal: AbortSignal, name: string, secret: string) => Promise<Message> = async (signal, name, secret) => {
  const response = await fetch(`/santa/api/result/${name}/${secret}`, {signal});
  return await response.json();
};

const Jumbotron: FC<PropsWithChildren<{}>> = ({children}) => (
  <div className="bg-light my-3 p-5 ">
    <div className="container-fluid py-5">
      {children}
    </div>
  </div>
);

interface ParticipantItemProps extends Participant {
  onClick?: MouseEventHandler;
};

const ParticipantItem: FC<ParticipantItemProps> = ({name, onClick}) => (
  <Row className="justify-content-center">
    <Col md={4}>
      <div className="bg-light p-3 mb-2">
        <span>{name}</span>
        <Button className="btn-close float-end" onClick={onClick}/>
      </div>
    </Col>
  </Row>
);

const ParticipantView: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const abortController = new AbortController();
    const {signal} = abortController;

    (async () => {
      setParticipants(await fetchParticipants(signal));
      setLoading(false);
    })();

    return () => abortController.abort();
  }, [loading]);

  const onClick = async(participant: Participant) => {
    const message = await deleteParticipant(participant);
    console.info(message);
    setLoading(true);
  };

  return (
    <>
    {participants.length > 0 ? (
      <>
        <h2>Participants</h2>
        <div className="py-4">
          {participants.map((participant, index) => <ParticipantItem {...participant} key={index} onClick={() => onClick(participant)}/>)}
        </div>
      </>
    ): null}
      <AddParticipant/>
    </>
  );
};

const SecretView: FC<{name: string, secret: string}> = ({name, secret}) => {
  const [message, setMessage] = useState<Message>();

  useEffect(() => {
    const abortController = new AbortController();
    const {signal} = abortController;

    (async () => {
      setMessage(await fetchResult(signal, name, secret));
    })();

    return () => abortController.abort();
  }, [name, secret]);

  if (!message) {
    return null;
  }

  if (message.status === "success") {
    return (
      <>
        <p>Your secret santa is</p>
        <h2>{message.message}</h2>
      </>
    )
  }

  return (
    <>
      <h2>You Are Registered</h2>
      <p>
        <strong>Name:</strong> {name} <strong>Passcode:</strong> {secret}
      </p>
      <p>Bookmark this page and visit again when the countdown expires to see your secret santa.</p>
    </>
  );
}

const App: FC = () => {
  const [cutoff, setCutoff] = useState<Date>();

  useEffect(() => {
    const abortController = new AbortController();
    const {signal} = abortController;

    (async () => {
      setCutoff(await fetchCutoffTime(signal));
    })();

    return () => abortController.abort();
  }, []);

  return (
    <Container className="App text-center">
      <Jumbotron>
        <h1>🎅 Secret Santa</h1>
        <div>{cutoff ? <CountdownTimer date={cutoff}/> : "Loading..."}</div>
      </Jumbotron>
      <Switch>
        <Route exact path="/santa" render={() =><ParticipantView/>}/>
        <Route exact path="/santa/result/:name/:secret" render={(props) => <SecretView {...props.match.params}/>}/>
      </Switch>
    </Container>
  );
};

export default App;
