import React, { useRef, useContext } from 'react'
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { ContractContext } from '../../context/contractContext';


const CreateCampaignContainer = (props) => {
    const contractContext = useContext(ContractContext);
    const { createCampaign, showSpinner } = contractContext;
    const minimumContribution = useRef(0);
    const handleFormSubmit = (e) => {
        e.preventDefault();
        createCampaign(minimumContribution.current.value);
    };

    const homePageHandler = () => {
        props.history.push("/");
    }

    return (
        <div className="container">
            <div className="row">
                <h4 className="pt-3 pb-2 text-left">Create New Campaign</h4>
            </div>
            <div className="row">
                <div className="col-4 pl-0 mt-2">
                    <Form className="text-left" onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formMinContribution">
                            <Form.Label>Minimum Contribution (wei)</Form.Label>
                            <InputGroup className="">
                                <Form.Control type="number" placeholder="Enter contribution" ref={minimumContribution} required />
                                <InputGroup.Prepend>
                                    <InputGroup.Text>wei</InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </Form.Group>
                        <Button variant="outline-primary" type="submit" className="app-btn">
                            {!showSpinner && 'SUBMIT'}
                            {showSpinner && <Spinner animation="border" />}
                        </Button>
                        <Button variant="outline-primary" onClick={homePageHandler} className="ml-2 app-btn">BACK</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaignContainer;