import slib from "@randajan/simple-lib";

slib(
    true,                              //false = start dev server; true = generate build;
    {
        mode:"node",                    //"web"=frontend lib, "node"=backend lib
        external:["chalk"],
        lib:{
            minify:false,               //lib minify - true = generate minify build; if null then isProd value will be used
            //entries:["index.js"],       //lib entries files
        }                                
    }
)