import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { buildCampaignContractInstance } from './utility';
import { Button } from 'react-bootstrap';
import ContributeForm from '../../components/Contribute';
import CampaignCard from '../../components/CampaignCard';

const CampaignDetailsContainer = (props) => {
    let { address } = useParams();
    const [campaignDetails, setCampaignDetails] = useState({
        'minimumContribution': 0,
        'balance': 0,
        'numberOfRequests': 0,
        'approversCount': 0,
        'managerAddress': '',
        'isManager': false
    });
    const [showSpinner, setShowSpinner] = useState(false);

    const populateCampaignDetails = async (instance, account) => {
        await instance.methods.getCampaignSummary().call()
            .then(response => {
                if (response) {
                    setCampaignDetails({
                        'minimumContribution': response['0'],
                        'balance': response['1'],
                        'numberOfRequests': response['2'],
                        'approversCount': response['3'],
                        'managerAddress': response['4'],
                        'isManager': response['4'] === account,
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        const fetchContractInstance = async () => {
            const { instance, account } = await buildCampaignContractInstance(address);
            populateCampaignDetails(instance, account);
        };
        fetchContractInstance();
    }, [address]);

    const handleFormSubmit = async (e, minContribution) => {
        e.preventDefault();
        setShowSpinner(true);
        const { instance, account } = await buildCampaignContractInstance(address);
        await instance.methods.contribute().send({
            from: account,
            value: minContribution
        })
            .then(res => {
                populateCampaignDetails(instance, account);
                setShowSpinner(false);
                toast.success("Campaign has been updated with your contribution !");
            })
            .catch(err => {
                console.log(err);
                setShowSpinner(false);
                toast.error(err.message ? err.message : "Something went wrong ! Please try after sometime.")
            })
    }

    const viewRequestsHandler = () => {
        props.history.push(`/campaign/${address}/requests`);
    }

    const homePageHandler = () => {
        props.history.push(`/`);
    }

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <h4 className="pt-3 pb-2 text-left">Campaign Details</h4>
            </div>
            <div className="row">
                <div className="col-8">
                    <div className="row">
                        <div className="col-6">
                            <CampaignCard title="Minimum Contribution(Wei)"
                                subTitle="You must contribute at least this much wei to become approver">
                                <span>{campaignDetails.minimumContribution}</span>
                            </CampaignCard>
                        </div>
                        <div className="col-6">
                            <CampaignCard title="Campaign Balance(wei)"
                                subTitle="The balance is how much money this campaign has left to spend">
                                <span>{campaignDetails.balance}</span>
                            </CampaignCard>
                        </div>
                        <div className="col-6">
                            <CampaignCard title="Requests"
                                subTitle="A request tries to withdraw money from the contract">
                                <span>{campaignDetails.numberOfRequests}</span>
                            </CampaignCard>
                        </div>
                        <div className="col-6">
                            <CampaignCard title="Number of Approvers"
                                subTitle="Number of people who have already donated to this campaign">
                                <span>{campaignDetails.approversCount}</span>
                            </CampaignCard>
                        </div>
                        <div className="col-6">
                            <Button variant="outline-primary" onClick={viewRequestsHandler} className="float-left m-2 app-btn">View Requests</Button>
                            <Button variant="outline-primary" onClick={homePageHandler} className="float-left m-2 app-btn">Back</Button>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <ContributeForm onHandleFormSubmit={handleFormSubmit}
                        showSpinner={showSpinner} />
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailsContainer;