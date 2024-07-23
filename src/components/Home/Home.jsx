import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from '../Navbar';
import UserContext from './../UserContext';

const Home = () => {
    const { userData } = useContext(UserContext);

    return (
        <>
            <NavbarComponent userData={userData} />
            <section className='home__section'>
                <Outlet />
            </section>
        </>
    );
};

export default Home;
