import React from 'react';
import CardItem from './CardItem';
import './Cards.css';
function Cards() {
    return(
        <div className='cards'>
            <h1>Check out these detinations</h1>
            <div className="cards__container">
                <div className='cards__wrapper'>
                    <ul className='cards__items'>
                        <CardItem 
                            src="images/img-9.jpg"
                            text="Explore something idk"
                            label='Adventure'
                            path="/AboutMe"
                        />

                        <CardItem 
                            src="images/img-5.jpg"
                            text="Projects"
                            label='Cool stuff'
                            path="/AboutMe"
                        />                        
                    </ul>

                    <ul className='cards__items'>
                        <CardItem 
                            src="images/img-7.jpg"
                            text="Ceta Robotics"
                            label='Cool stuff'
                            path="/Projects"
                        />

                        <CardItem 
                            src="images/img-4.jpg"
                            text="FRC Robotics"
                            label='Woah'
                            path="/Projects"
                        />

                        <CardItem 
                            src="images/img-3.jpg"
                            text="2D Platformer"
                            label='Adventure'
                            path="/Projects"
                        />

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cards;