import Navbar from '../component/Navbar';
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <div>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Navbar />
                <Box>
                    <Outlet/>
                </Box>
            </Box>
            {/* <Footer /> */}
        </div>
    );
}

export default MainLayout;