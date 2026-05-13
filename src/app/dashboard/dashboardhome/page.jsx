"use client"
import useRole from '@/app/(site)/hooks/useRole';
import Loading from '@/app/components/Loading';
import React from 'react';
import Adminhome from '../adminhome/page';
import Riderhome from '../riderhome/page';
import Userhome from '../userhome/page';

const DashboardHome = () => {

    const {role,isLoading} =useRole();
    if(isLoading){
       return <Loading/>
    }

    if(role === "admin"){
        return <Adminhome/>
    }
    else if(role === "rider"){
        return <Riderhome/>
    }
    else{
        return <Userhome/>
    }

    return (
        <div>
            <h1>hellow wolrd</h1>
        </div>
    );
};

export default DashboardHome;