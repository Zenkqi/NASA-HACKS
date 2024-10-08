import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import './Navbar.css';


function Navbar() {
    const [click, setClick] = useState(false);
    // Update the state of the menu button
    const [button, setButton] = useState(true);

    const showButton = () => {
        if(window.innerWidth <= 960){
            setButton(false);
        }
        else{
            setButton(true);
        }
    }

    useEffect(() => {
        showButton()
    }, []);

    window.addEventListener('resize', showButton);

    const handleClick = () => setClick(!click);
    // Reverses the state of the click

    const closeMobileMenu = () => setClick(false);
    // Closes the menu

    return(
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to="/" className='navbar-logo' onClick={closeMobileMenu}>
                        Orrey <i className='fab fa-typo3'/>
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                    </div>

                    <ul className={click ? 'nav-menu active' : 'nav-menu '/* */}>
                        <li className='nav-item'>
                            <Link to='/Home' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>

                    </ul>

                    {button  && <Button buttonStyle='btn--outline'>LEARN MORE</Button>}

                </div>
            </nav>
        </>
    )
}

export default Navbar;