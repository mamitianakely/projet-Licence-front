import React from 'react';


export default function Sidebar () {
    return(
        <div className='parents'>
            <div className='m-2'>
                <i className='bi bi-bootstrap-fill me-2 fs-4'></i>
                <span className='brand-name fs-4'>URBANISM APPLICATION</span>
            </div>
            <hr className='text-dark'></hr>
            <div className='list-group list-group-flush'>
                <a className='list-group-item py-2 my1' href='#'>
                    <i className='bi bi-house fs-3 me-2'></i>
                    <span className='fs-3'>Accueil</span>
                </a>
                <a className='list-group-item py-2 my1' href='#'>
                    <i className='bi bi-speedometer fs-3 me-2'></i>
                    <span className='fs-3'>Tableau de bord</span>
                </a>
                <a className='list-group-item py-2 my1' href='#'>
                    <i className='bi bi-calendar fs-3 me-2'></i>
                    <span className='fs-3'>Calendrier</span>
                </a>
                <a className='list-group-item py-2 my1' href='#'>
                    <i className='bi bi-house fs-3 me-2'></i>
                    <span className='fs-3'>Accueil</span>
                </a>
            </div>
        </div>
    )
}
