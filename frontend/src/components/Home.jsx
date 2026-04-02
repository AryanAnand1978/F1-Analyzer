import OpeningTitles from "../assets/images/hero/Opening_Titles.mp4";
import analysisHome from "../assets/images/gallery/analysisHome.png";
import predictorHome from "../assets/images/gallery/Predictor.jpg";
import teamsHome from "../assets/images/gallery/teams.jpg";
import driversHome from "../assets/images/gallery/drivers.jpg";
import historyBanner from "../assets/images/gallery/historyBanner.jpg";
import galleryHome from "../assets/images/gallery/galleryHome.jpg";
import { useEffect } from "react";
import { Link } from "react-router-dom";



export default function Home() {
  useEffect(() => {
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
      heroVideo.playbackRate = 1.75;
    }

    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".topic-box").forEach((box) => {
      observer.observe(box);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      

      <header className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={OpeningTitles} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1 className="fade-in">
            BEYOND THE <span className="red">LIMIT</span>
          </h1>
          <p className="fade-in">PRECISION. DATA. SPEED.</p>
        </div>
      </header>

      <main className="topics-grid">

        <section className="topic-box analyzer">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${analysisHome})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">DATA ENGINE</span>
            <h2>Analyzer</h2>
            <p>Deep dive into lap times and telemetry data.</p>
            <Link to="/analyzer" className="btn-action">
              Launch Analyzer
            </Link>
          </div>
        </section>

        <section className="topic-box predictor">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${predictorHome})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">AI MODELLING</span>
            <h2>Predictor</h2>
            <p>Run race simulations and calculate podium probabilities.</p>
            <Link to="/predictor" className="btn-action">
              Start Simulation
            </Link>
          </div>
        </section>

        <section className="topic-box teams">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${teamsHome})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">CONSTRUCTORS</span>
            <h2>Teams</h2>
            <p>Technical breakdowns and factory insights.</p>
            <Link to="/teams" className="btn-action">
              Explore Teams
            </Link>
          </div>
        </section>

        <section className="topic-box drivers">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${driversHome})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">THE PILOTS</span>
            <h2>Drivers</h2>
            <p>Profiles and real-time performance tracking.</p>
            <Link to="/drivers" className="btn-action">
              Meet the Grid
            </Link>
          </div>
        </section>

        <section className="topic-box history">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${historyBanner})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">HERITAGE</span>
            <h2>History</h2>
            <p>Relive the classic eras of F1.</p>
            <Link to="/history" className="btn-action">
              View Timeline
            </Link>
          </div>
        </section>

        <section className="topic-box gallery">
          <div
            className="box-bg"
            style={{ backgroundImage: `url(${galleryHome})`, backgroundSize: "cover" }}
          ></div>
          <div className="box-content">
            <span className="topic-label">VISUALS</span>
            <h2>Gallery</h2>
            <p>Race weekend highlights and technical captures.</p>
            <Link to="/gallery" className="btn-action">
              Enter Gallery
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
