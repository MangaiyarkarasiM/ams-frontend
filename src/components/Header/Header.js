import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <div className='wrapper'>
            <div className="text-warning font-weight-bold bg-secondary brand text-center font-italic">assetRef</div>
            <ul className="sidebar fixed navbar-nav bg-secondary my-0 mx-0 collapse show" id="sideBar">
                <NavLink className="nav-item" to="/dashboard"><i className='fa fa-tachometer text-warning'></i> <span className='nav-title'>Dashboard</span></NavLink>
                <hr className="sidebar-divider" ></hr>
                <div className="sidebar-heading text-white-50 text-uppercase font-weight-bold ">Addition</div>
                <NavLink className="nav-item" to="/assets"><i className="fa fa-laptop text-warning" aria-hidden="true"></i> <span className='nav-title'>Assets</span></NavLink>
                <NavLink className="nav-item" to="/locations"><i className="fa fa-globe text-warning" aria-hidden="true"></i> <span className='nav-title'>Locations</span></NavLink>
                <hr className="sidebar-divider"></hr>
                <div className="sidebar-heading text-white-50 text-uppercase font-weight-bold ">Transactions</div>
                <NavLink className="nav-item" to="/assignment"><i className="fa fa-tasks text-warning" aria-hidden="true"></i> <span className='nav-title'>Assignment</span></NavLink>
                <NavLink className="nav-item" to="/dispose"><i className="fa fa-trash-o text-warning" aria-hidden="true"></i> <span className='nav-title'>Dispose</span></NavLink>
                <NavLink className="nav-item" to="/recover"><i className="fa fa-trash-o text-warning" aria-hidden="true"></i> <span className='nav-title'>Recover</span></NavLink>
                <hr className="sidebar-divider m-0"></hr>
                <NavLink className="nav-item" to="/maintenance"><i className="fa fa-wrench text-warning" aria-hidden="true"></i> <span className='nav-title'>Maintenance</span></NavLink>
            </ul>
        </div>
    );
};

export default Header;