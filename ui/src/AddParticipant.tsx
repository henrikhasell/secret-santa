import React, {FC, FormEventHandler, useRef, useState} from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

interface Message {
  message: string;
  status: "success" | "failure";
};

const AddParticipant: FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const onSubmit: FormEventHandler<HTMLFormElement> = async(event) => {
    const {current} = inputRef;
    event.preventDefault();
    if (!current) {
      return;
    }
    const result = await fetch("/santa/api/participants", {
      body: JSON.stringify({name: current.value}),
      headers: {'Content-Type': 'application/json'},
      method: "POST",
    });
    const message: Message = await result.json();
    if (message.status === "success") {
      history.push(`/santa/result/${current.value}/${message.message}`);
    };
    current.value = "";
  };

  return (
    <Row className="justify-content-center" onSubmit={onSubmit}>
      <Col md={5}>
        <Form className="d-flex">
          <Form.Control onChange={(i) => setDisabled(i.target.value === "")} ref={inputRef} type="text" placeholder="Add Participant" />
          <Button className="ms-2" disabled={disabled} type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default AddParticipant;