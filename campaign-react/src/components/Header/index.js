import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Header = (props) => {
    return (
        <header className="header p-1">
            <div className="container">
                <div className="row">
                    <div className="col-12 pl-0 clearfix">
                        <div className="float-left">
                            <Link to="/">
                                <h1 className="float-left">Campaign Starter</h1>
                            </Link>
                        </div>
                        <div className="float-right pt-3">
                            <Link to="/campaign/new" className="text-white ">Add New Campaign</Link>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;