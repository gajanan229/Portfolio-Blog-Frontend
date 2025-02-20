import React, {useState} from "react";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import ProjectList from "./ProjectList";
import Contact from "./Contact";
import Footer from "./Footer";
import '../../public/styles.css'
import WorkExperience from "./WorkExperience";
import Chatbot from "./Chatbot";

function HomePage () {
    return (
        <div >
            <Header />
            <Home />
            <About />
            <ProjectList />
            <WorkExperience />
            <Contact />
            <Footer />
            <Chatbot />
        </div>
    );
}
export default HomePage ;