import React, { useContext, useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ContractContext } from '../../context/contractContext';
import './style.css';


const CampaignsContainer = (props) => {
    const contractContext = useContext(ContractContext);
    const { contractInst, accounts } = contractContext;
    const [campaigns, setCampaigns] = useState([]);

    const getDeployedContracts = async (contractInst) => {
        if (contractInst) {
            const deployedContracts = await contractInst.methods.getDeployedContracts().call({
                from: accounts[0]
            });
            setCampaigns(deployedContracts);
        }
    }
    useEffect(() => {
        getDeployedContracts(contractInst);
    }, [contractInst]);

    const handleCreateCampaign = () => {
        props.history.push("/campaign/new");
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <h4 className="pt-3 pb-2 text-left">Open Campaigns</h4>
                </div>
                <div className="row">
                    <div className="col-9">
                        <div className="row">
                            <div className="col-9 pl-0">
                                <ListGroup className="">
                                    {campaigns && campaigns.map((camp) => {
                                        return <ListGroup.Item key={camp} className="p-3 mb-3">
                                            <div className="text-left">
                                                <h6><strong>Address :</strong> {camp}</h6>
                                                <Link to={'/campaign/'+camp}>View Campaign</Link>
                                            </div>
                                        </ListGroup.Item>
                                    })}
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="row">
                            <div className="col">
                                <Button variant="outline-primary" onClick={handleCreateCampaign} className="app-btn">Create Campaign</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignsContainer;