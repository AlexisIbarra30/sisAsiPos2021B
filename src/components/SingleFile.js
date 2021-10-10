import React from 'react';

const SingleFile = (props) => (
    <div className='registerItem'>
        <div className='imageContainer'>
            <img className='registerimage' src='./images/fileIcon.svg' />
            <p className='loginText'> {props.name} </p>
        </div>
        <button onClick={ () => {
            props.handleDelete(props.index)
        }}> remover </button>
    </div>
);

export default SingleFile;