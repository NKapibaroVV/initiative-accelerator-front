let preloader = <div key={`preloader-${new Date().getTime()}`} style={{ width: "fit-content" }} className="mx-auto">
    <div className="spinner-grow text-info mx-2" role="status" />
    <div className="spinner-grow text-info mx-2" role="status" />
    <div className="spinner-grow text-info mx-2" role="status" />
</div>

export default preloader;
