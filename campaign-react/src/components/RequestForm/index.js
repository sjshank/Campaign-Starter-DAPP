import React, { useRef } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import "./style.css";

const RequestForm = (props) => {
    const descriptionEle = useRef("");
    const amountEle = useRef(0);
    const recipientEle = useRef("");

    const onHandleFormSubmit = (e) => {
        e.preventDefault();
        props.formSubmitHandler(descriptionEle.current.value, amountEle.current.value, recipientEle.current.value);
    }

    return (
        <Form className="card request-form p-2 pl-3 pr-3 mt-3 mb-3" onSubmit={onHandleFormSubmit}>
            <h4 className="text-center font-weight-bold">Submit New Request</h4>
            <Form.Group className="text-left" controlId="formGroupDescription">
                <Form.Label className="text-left font-weight-bold">Description</Form.Label>
                <Form.Control type="text" placeholder="Request description" ref={descriptionEle} required />
            </Form.Group>
            <Form.Group className="text-left" controlId="formGroupAmount">
                <Form.Label className="text-left font-weight-bold">Withdrawal Amount</Form.Label>
                <Form.Control type="number" placeholder="Amount to be transfer to recipient" ref={amountEle} required />
            </Form.Group>
            <Form.Group className="text-left" controlId="formGroupRecipientAdd">
                <Form.Label className="text-left font-weight-bold">Recipient Address</Form.Label>
                <Form.Control type="text" placeholder="Recipient address" ref={recipientEle} required />
            </Form.Group>
            <div className="mt-2">
                <Button variant="outline-primary" type="submit" className="app-btn mr-2">
                    {!props.showSpinner && 'SUBMIT'}
                    {props.showSpinner && <Spinner animation="border" size="md" />}
                </Button>
                <Button variant="outline-primary" onClick={props.formCancelHandler} className="app-btn">CANCEL</Button>
            </div>
        </Form>
    );
};

export default RequestForm;