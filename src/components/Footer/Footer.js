import React from 'react';
import {Link} from 'react-router-dom';
import './Footer.css'

function Footer(props) {
    return (
        <div className="d-flex align-items-center flex-column justify-content-start bg-secondary">
            <div className='mt-4 ml-3 text-warning'>
                ©️ 2022 assetRef
            </div>
            <div className='d-flex align-items-start justify-content-start'>
            <div className='mx-3 my-3'>
                <Link to='#' className='footer-item'>About us</Link>
            </div>
            <div className='vl'></div>
            <div className='mx-3 my-3'>
                <Link to='#' className='footer-item'>Customer Care</Link>
            </div>
            <div className='vl'></div>
            <div className='mx-3 my-3'>
                <Link to='#' className='footer-item'>Feedback</Link>
            </div>
            </div>
        </div>
    );
}

export default Footer;