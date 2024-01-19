import root from "app-root-path";
import { RSCX } from "./RSCX.js";
import chokidar from "chokidar";


export const RSCbuild = ({live, version, entries, srcDir="src", distDir="dist"})=>{
    srcDir = root.path + "/" + srcDir;
    distDir = root.path + "/" + distDir;

    const build = _=>{
        console.log(`${(new Date()).toLocaleTimeString()} - RSC rebuild`);
        entries.forEach(pathname=>{
            const file = RSCX.create(srcDir + "/" + pathname);
            try {
                file.export( distDir + "/" + file.filename + " " + version, { version });
            } catch(err) {
                console.warn(err.message);
            }
        });
        
    }

    if (!live) { return build(); }
    
    let _int;
    chokidar.watch(srcDir).on('all', _ => {
        clearTimeout(_int);
        _int = setTimeout(build, 500);
    });
    

}



