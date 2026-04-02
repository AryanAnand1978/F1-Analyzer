import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import firstHistory from '../assets/images/gallery/1stHistory.jpg'
import analysisHome from '../assets/images/gallery/analysisHome.png'
import driversGrid from '../assets/images/gallery/drivers.jpg'
import galleryHome from '../assets/images/gallery/galleryHome.jpg'
import huntVsLauda from '../assets/images/gallery/HuntvsLauda.jpg'
import maxVsLewis from '../assets/images/gallery/maxvsLewis.jpg'
import monoChasis from '../assets/images/gallery/monoChasis.png'
import predictorHome from '../assets/images/gallery/Predictor.jpg'
import schumacherEra from '../assets/images/gallery/schumacher.jpg'
import sennaProst from '../assets/images/gallery/Senna_Prost.jpg'
import teamsGrid from '../assets/images/gallery/teams.jpg'
import turboHybrid from '../assets/images/gallery/turbo-hybrid.jpg'

const modernEraShots = [
    { src: analysisHome, alt: 'F1 circuit analytics dashboard and SQL insights', fit: 'cover' },
    { src: predictorHome, alt: 'AI predictive analytics concept for race strategy', fit: 'contain' },
    { src: driversGrid, alt: 'Modern Formula 1 driver lineup portrait', fit: 'cover' },
    { src: teamsGrid, alt: 'Formula 1 teams and 2026 contenders showcase', fit: 'cover' },
    { src: turboHybrid, alt: 'Mercedes turbo-hybrid Formula 1 car in action', fit: 'cover' },
    { src: galleryHome, alt: 'Verstappen and Hamilton Abu Dhabi final lap duel', fit: 'cover' }
]

const heritageShots = [
    { src: firstHistory, alt: 'Early Formula 1 era black and white race car', fit: 'contain' },
    { src: monoChasis, alt: '1962 Lotus monocoque chassis design tribute', fit: 'contain' },
    { src: sennaProst, alt: 'Ayrton Senna and Alain Prost during McLaren years', fit: 'cover' },
    { src: huntVsLauda, alt: 'Niki Lauda and James Hunt rivalry moment', fit: 'cover' },
    { src: schumacherEra, alt: 'Michael Schumacher celebrating Ferrari era success', fit: 'cover' },
    { src: maxVsLewis, alt: 'Max Verstappen and Lewis Hamilton wheel-to-wheel battle', fit: 'cover' }
]

function Gallery() {
    useEffect(() => {
        // Marquee animations are handled by CSS
    }, []);

    return (
        <div className="gallery-page">

            <nav className="navbar">
                <div className="logo">F1<span className="red">APEX</span></div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/races">Races</Link></li>
                    <li><Link to="/drivers">Drivers</Link></li>
                    <li><Link to="/teams">Teams</Link></li>
                    <li><Link to="/analyzer">Analyzer</Link></li>
                    <li><Link to="/predictor">Predictor</Link></li>
                    <li><Link to="/history">History</Link></li>
                    <li><Link to="/gallery" className="active">Gallery</Link></li>
                </ul>
            </nav>

            <header className="gallery-header">
                <h1>VISUAL <span className="red">VELOCITY</span></h1>
                <p>Moments of Unstoppable </p>
            </header>

            <div className="marquee-container">
                <div className="marquee-row marquee-left">
                    <div className="marquee-content">
                        {modernEraShots.map((image) => (
                            <img
                                key={image.alt}
                                src={image.src}
                                alt={image.alt}
                                className={image.fit === 'contain' ? 'fit-contain' : 'fit-cover'}
                            />
                        ))}
                    </div>
                    <div className="marquee-content" aria-hidden="true">
                        {modernEraShots.map((image) => (
                            <img
                                key={`${image.alt}-dup`}
                                src={image.src}
                                alt={image.alt}
                                className={image.fit === 'contain' ? 'fit-contain' : 'fit-cover'}
                            />
                        ))}
                    </div>
                </div>

                <div className="marquee-row marquee-right">
                    <div className="marquee-content">
                        {heritageShots.map((image) => (
                            <img
                                key={image.alt}
                                src={image.src}
                                alt={image.alt}
                                className={image.fit === 'contain' ? 'fit-contain' : 'fit-cover'}
                            />
                        ))}
                    </div>
                    <div className="marquee-content" aria-hidden="true">
                        {heritageShots.map((image) => (
                            <img
                                key={`${image.alt}-dup`}
                                src={image.src}
                                alt={image.alt}
                                className={image.fit === 'contain' ? 'fit-contain' : 'fit-cover'}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Gallery