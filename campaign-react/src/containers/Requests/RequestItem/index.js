import React from 'react';
import { Button } from 'react-bootstrap';
import './style.css';


const RequestItem = (props) => {
    return (
        <tr className={props.req.complete ? 'completed-request' : ''}>
            <td>{props.req.description}</td>
            <td>{props.req.value}</td>
            <td>{props.req.recipient}</td>
            <td>{props.req.approvalCount}</td>
            <td>
                {!props.isManager && !props.req.complete && <Button variant="outline-success" onClick={() => props.handleApprove(props.index)} className="pt-0 pb-0 tbl-btn">Approve</Button>}
                {props.isManager && !props.req.complete && <Button variant="outline-success" onClick={() => props.handleFinalize(props.index)} className="pt-0 pb-0 tbl-btn">Finalize</Button>}
                {/* <Button variant="outline-danger" onClick={() => handleDelete(index)} className="app-btn pt-0 ml-1 pb-0 tbl-btn">Delete</Button> */}
            </td>
            {/* <td>
                {props.req.complete ? <strong className="text-success">Complete</strong> : 'In Progress'}
            </td> */}
        </tr>
    );
};

export default RequestItem;