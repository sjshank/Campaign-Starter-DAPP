import React from 'react';
import { Card} from 'react-bootstrap';

const CampaignCard = (props) => {
    return (
        <Card className="m-2">
            <Card.Body className="text-left">
                <Card.Title>{props.children}</Card.Title>
                <Card.Subtitle className="text-muted">{props.title}</Card.Subtitle>
                <Card.Text><small>{props.subTitle}</small></Card.Text>
            </Card.Body>
        </Card>
    );
};

export default CampaignCard;