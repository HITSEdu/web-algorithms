import {useState} from "react";
import './Tree.css';

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/tree";

const Tree: React.FC = () => {

    return (
        <div className='grid-container'>
            <span
            style={{
                color: "white",
                fontSize: "3rem",
                margin: "12vh",
                userSelect: "none",
            }}
            >Здесь пока ничего нет...</span>
        </div>
    );
};

export default Tree;
