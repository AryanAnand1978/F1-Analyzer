import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import firstHistory from '../assets/images/gallery/1stHistory.jpg'
import historyBanner from '../assets/images/gallery/historyBanner.jpg'
import monoChasis from '../assets/images/gallery/monoChasis.png'
import huntVsLauda from '../assets/images/gallery/HuntvsLauda.jpg'
import sennaProst from '../assets/images/gallery/Senna_Prost.jpg'
import schumacherEra from '../assets/images/gallery/schumacher.jpg'
import turboHybrid from '../assets/images/gallery/turbo-hybrid.jpg'
import maxVsLewis from '../assets/images/gallery/maxvsLewis.jpg'
import analysisHome from '../assets/images/gallery/analysisHome.png'

export default function History() {
  useEffect(() => {
    // Timeline animations handled by CSS
  }, []);

  return (
    <>
    <header className="hero history-hero" style={{ backgroundImage: `url(${historyBanner})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-text">
            <h1 className="fade-in">THE <span className="red">EVOLUTION</span></h1>
            <p className="fade-in">FROM GLORIOUS PAST TO DIGITAL FUTURE</p>
        </div>
    </header>

    <main className="timeline-container">
        <div className="timeline-line"></div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">1950</div>
            <div className="timeline-content">
                <span className="tag">The Inaugural Season</span>
                <h2>The Birth of F1</h2>
                <p>The first official World Championship race took place at Silverstone. Giuseppe Farina won in an Alfa
                    Romeo, beginning the era of front-engined giants.</p>
                <img className="timeline-image fit-cover" src={firstHistory} alt="1950s Formula 1 season at Silverstone" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">1962</div>
            <div className="timeline-content">
                <span className="tag">Innovation</span>
                <h2>The Monocoque Revolution</h2>
                <p>Colin Chapman introduced the Lotus 25—the first car with a monocoque chassis. It was lighter,
                    stiffer, and faster, changing car design forever.</p>
                <img className="timeline-image fit-contain" src={monoChasis} alt="Lotus monocoque chassis innovation in 1962" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">1976</div>
            <div className="timeline-content">
                <span className="tag">Legendary Duel</span>
                <h2>Hunt vs. Lauda</h2>
                <p>The most dramatic season in history. Niki Lauda returned from a near-fatal crash to fight James Hunt
                    in a rain-soaked Japanese finale.</p>
                <img className="timeline-image fit-cover" src={huntVsLauda} alt="James Hunt and Niki Lauda rivalry in 1976" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">1988</div>
            <div className="timeline-content">
                <span className="tag">The MP4/4 Era</span>
                <h2>Senna & Prost Dominance</h2>
                <p>McLaren won 15 out of 16 races. Ayrton Senna claimed his first title, cementing his status as a "Rain
                    Master" and global icon.</p>
                <img className="timeline-image fit-cover" src={sennaProst} alt="Ayrton Senna and Alain Prost during McLaren era" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2004</div>
            <div className="timeline-content">
                <span className="tag">The Schumacher Era</span>
                <h2>Michael's 7th Heaven</h2>
                <p>Michael Schumacher secured his record-breaking 7th World Title with Ferrari. The V10 era reached its
                    technical and acoustic peak.</p>
                <img className="timeline-image fit-cover" src={schumacherEra} alt="Michael Schumacher during Ferrari title dominance" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2014</div>
            <div className="timeline-content">
                <span className="tag">Efficiency</span>
                <h2>The Turbo-Hybrid Era</h2>
                <p>F1 moved to 1.6L V6 Hybrid units. Mercedes began an unprecedented 8-year streak of Constructors'
                    Titles, led by Lewis Hamilton.</p>
                <img className="timeline-image fit-cover" src={turboHybrid}
                    alt="Turbo-hybrid era Formula 1 engineering" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2021</div>
            <div className="timeline-content">
                <span className="tag">Controversy</span>
                <h2>Abu Dhabi Showdown</h2>
                <p>Max Verstappen and Lewis Hamilton entered the final race equal on points. A last-lap overtake secured
                    Verstappen's first title in dramatic fashion.</p>
                <img className="timeline-image fit-cover" src={maxVsLewis} alt="Max Verstappen versus Lewis Hamilton title decider" />
            </div>
        </div>

        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2026</div>
            <div className="timeline-content">
                <span className="tag">The Future</span>
                <h2>Sustainable Racing</h2>
                <p>A massive rule change: 100% sustainable fuels and a 50/50 power split between electric and combustion
                    engines. The next chapter begins.</p>
                <img className="timeline-image fit-contain" src={analysisHome} alt="Future of Formula 1 data analytics and telemetry" />
            </div>
        </div>
    </main>

    </>
  );
}