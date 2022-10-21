import { Button, Chip } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
    return (
        <div className="pb-3 mx-0" style={{
            marginTop: "2rem"
        }}>
            <div className="row w-100 justify-content-center">
                <div className="col-12 text-center">
                    <Chip label="Разработал AlexC-ux" variant="outlined" component="a" href="https://github.com/AlexC-ux?tab=repositories" icon={<GitHubIcon/>}/>
                </div>
            </div>
        </div>
    )
}
export default Footer;