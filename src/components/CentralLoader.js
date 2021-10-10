import {useState,useEffect} from 'react';

export default function CentralLoader(){

    return(
        <div className="loader-container">
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    );

}