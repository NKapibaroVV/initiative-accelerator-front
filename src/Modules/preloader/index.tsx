import { Skeleton } from "@mui/material";

let preloader = <div key={`preloader-${new Date().getTime()}`} className="mx-auto">
    <Skeleton variant="rounded"  sx={{
        width:"100%",
        height:"190px",
    }} />
</div>

export default preloader;
