import React from "react";
import Auth from "../../utils/auth";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Nav() {
    const renderNavigation = () => {
        if (Auth.loggedIn()) {
            return (
                <ul className="flex-row">
                    <li className="mx-1">
                        <Link to="/orderHistory" variant="button">Order History</Link>
                    </li>
                    <li className="mx-1">
                        <Button href="/" onClick={Auth.logout} variant="text" color="inherit">Logout</Button>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="flex-row">
                    <li className="mx-1">
                        <Button component={Link} to="/signup" variant="text" color="inherit">Signup</Button>
                    </li>
                    <li className="mx-1">
                        <Button component={Link} to="/login" variant="text" color="inherit">Login</Button>
                    </li>
                </ul>
            );
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                    <Link to="/" color="inherit" underline="none">
                        <span role="img" aria-label="shopping bag"></span>
                        Web Shop
                    </Link>
                </Typography>
                <nav>{renderNavigation()}</nav>
            </Toolbar>
        </AppBar>
    );
}

export default Nav;
