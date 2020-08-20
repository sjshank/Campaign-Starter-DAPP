import React, { useRef } from 'react';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';

const ContributeForm = (props) => {
    const minimumContribution = useRef(0);
    return (
        <Form className="text-left" onSubmit={(e) => props.onHandleFormSubmit(e, minimumContribution.current.value)}>
            <Form.Group controlId="formMinContribution">
                <Form.Label>Contribute to this Campaign !</Form.Label>
                <InputGroup className="">
                    <Form.Control type="number" placeholder="Enter contribution" ref={minimumContribution} required />
                    <InputGroup.Prepend>
                        <InputGroup.Text>wei</InputGroup.Text>
                    </InputGroup.Prepend>
                </InputGroup>
            </Form.Group>
            <Button variant="outline-primary" type="submit" className="app-btn">
                {!props.showSpinner && 'CONTRIBUTE'}
                {props.showSpinner && <Spinner animation="border" size="md" />}
            </Button>
        </Form>
    );
};

export default ContributeForm