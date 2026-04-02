
"use client"
import HeroSection from "./HeroSection";
import VehicleSlider from "./VehicleSlider";
import AuthModel from "./AuthModel";
import { useState } from "react";

function PublicHome() {
    const [authOpen, setAuthOpen] = useState(false);
    return(
        <>
            <HeroSection onAuthRequired={() => setAuthOpen(true)} />
            <VehicleSlider />
            <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    )
}

export default PublicHome;