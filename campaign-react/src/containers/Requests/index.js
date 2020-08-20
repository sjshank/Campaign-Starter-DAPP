import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { buildCampaignContractInstance } from '../CampaignDetails/utility';
import { Table, Button, Spinner } from 'react-bootstrap';
import RequestForm from '../../components/RequestForm';
import RequestItem from './RequestItem';

const RequestsContainer = (props) => {
    let { address } = useParams();
    const [requests, setRequests] = useState([]);
    const [isManager, setIsManager] = useState(true);
    const [showRequestForm, setRequestForm] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);


    const populateAllRequest = async (instance) => {
        await instance.methods.getAllRequest().call()
            .then(res => {
                setShowSpinner(false);
                setRequests(res);
            })
            .catch(err => {
                console.error(err);
                setShowSpinner(false);
            });
    }

    useEffect(() => {
        const fetchContractInstance = async () => {
            setShowSpinner(true);
            const { instance, account } = await buildCampaignContractInstance(address);
            populateAllRequest(instance);
            await instance.methods.manager().call()
                .then(res => {
                    setShowSpinner(false);
                    setIsManager(res === account);
                })
                .catch(err => {
                    console.error(err);
                    setShowSpinner(false);
                    toast.error("Something went wrong ! Please try after sometime");
                })
        };
        fetchContractInstance();
    }, [address]);

    const handleNewRequest = () => {
        setRequestForm(true);
    }

    const handleFormSubmit = async (desc, amt, recipient) => {
        setShowSpinner(true);
        const { instance, account } = await buildCampaignContractInstance(address);
        instance.methods.createRequest(desc, amt, recipient).send({
            from: account
        })
            .then(res => {
                if (res) {
                    populateAllRequest(instance);
                    toast.success("Request has been submitted successfully !");
                }
            })
            .catch(err => {
                console.log(err);
                setShowSpinner(false);
                toast.error("Something went wrong ! Please try after sometime");
            })
    }

    const handleApprove = async (index) => {
        setShowSpinner(true);
        const { instance, account } = await buildCampaignContractInstance(address);
        instance.methods.approveRequest(index).send({
            from: account
        })
            .then(res => {
                populateAllRequest(instance);
                toast.success("Request has been approved successfully !");
            })
            .catch(err => {
                console.error(err);
                setShowSpinner(false);
                toast.error("Something went wrong ! Please try after sometime");
            })
    }

    const handleFinalize = async (index) => {
        setShowSpinner(true);
        const { instance, account } = await buildCampaignContractInstance(address);
        instance.methods.finalizeRequest(index).send({
            from: account
        })
            .then(res => {
                populateAllRequest(instance);
                toast.success("Request has been completed successfully !");
            })
            .catch(err => {
                console.error(err);
                setShowSpinner(false);
                toast.error("Something went wrong ! Please try after sometime");
            })
    }

    const handleCancel = () => {
        setRequestForm(false);
    }

    const campaignDetailsHandler = () => {
        props.history.push(`/campaign/${address}`);
    }

    // const handleDelete = async (index) => {
    //     setShowSpinner(true);
    //     const { instance, account } = await buildCampaignContractInstance(address);
    //     instance.methods.deleteRequest(index).send({
    //         from: account
    //     })
    //         .then(res => {
    //             populateAllRequest(instance);
    //             toast.success("Request has been deleted successfully !");
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             setShowSpinner(false);
    //             toast.error("Something went wrong ! Please try after sometime");
    //         })
    // }

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <h4 className="pt-3 pb-2 text-left">Withdrawal Requests</h4>
            </div>
            <div className="row">
                <div className="col pl-0">
                    <div className="float-right clearfix mb-2">
                    </div>
                    <Table striped bordered hover size="sm" className="clearfix mt-2">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Withdrawal Amount</th>
                                <th>Recipient Address</th>
                                <th>Total Approvals</th>
                                <th>Action</th>
                                {/* <th>Status</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length == 0 && <tr>
                                <td colSpan="6">No records found.</td>
                            </tr>}
                            {requests && requests.map((req, index) => {
                                return <RequestItem key={req.recipient + index}
                                    req={req}
                                    index={index}
                                    isManager={isManager}
                                    handleApprove={handleApprove}
                                    handleFinalize={handleFinalize}></RequestItem>
                            })}
                        </tbody>
                    </Table>
                    <div className="text-center mb-3">
                        <Button variant="outline-primary" onClick={handleNewRequest} disabled={!isManager} className="app-btn">
                            {!showSpinner && 'New Request'}
                            {showSpinner && <Spinner animation="border" size="md" />}
                        </Button>
                        <Button variant="outline-primary" onClick={campaignDetailsHandler} className="m-2 app-btn">Back</Button>
                    </div>
                </div>
            </div>
            <div className="container">
                {showRequestForm && <RequestForm showSpinner={showSpinner} formSubmitHandler={handleFormSubmit} formCancelHandler={handleCancel} />}
            </div>
        </div>
    );
};

export default RequestsContainer;