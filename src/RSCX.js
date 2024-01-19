import fse from "fs-extra";
import path from "path";

export class RSCX {

    static escapeScript(script) {
        return JSON.stringify(script).slice(1, -1);
    }

    static create(pathname) {
        return new RSCX(pathname);
    }

    constructor(pathname) {
        pathname = path.normalize(pathname);
        const parsed = path.parse(pathname);

        const enumerable = true;
        Object.defineProperties(this, {
            pathname:{ enumerable, value:pathname },
            dirname:{ enumerable, value:parsed.dir },
            filename:{ enumerable, value:parsed.name },
            extension:{ enumerable, value:parsed.ext },
        });
        
    }

    msg(msg, detail) {
        return `File ${this.pathname}: ${msg}` + (!detail ? "" : `\n${detail}`);
    }

    read() {
        try { return fse.readFileSync(this.pathname, 'utf8'); }
        catch (err) { throw new Error(this.msg("read failed", err.message)); }
    }

    parseJSON(json) {
        if (!json) { return {}; }
        try { return JSON.parse(json); }
        catch (err) { throw new Error(this.msg("json malformated", json)); }
    }

    injectVars(regex, raw, vars={}) {
        return raw.replace(regex, (match, v) =>{
            if (vars.hasOwnProperty(v)) { return vars[v]; }
            throw new Error(this.msg("missing variable", v));
        });
    }

    resolveLinks(regex, raw, vars={}, escape=false) {
        return raw.replace(regex, (match, pathname, json) => {
            const raw = RSCX.create(this.dirname + "/" + pathname).parse({...vars, ...this.parseJSON(json)});
            return escape ? RSCX.escapeScript(raw) : raw;
        });
    }

    parse(vars={}) {
        let raw = this.read();
        raw = this.injectVars(/\${([^}]+)}/g, raw, vars);
        raw = this.resolveLinks(/%%([^%\s]+)(?:\s+({.*}))?%%/g, raw, vars, false);
        return this.resolveLinks(/##([^#\s]+)(?:\s+({.*}))?##/g, raw, vars, true);
    }

    export(pathname, vars={}) {
        return fse.outputFileSync(path.normalize(pathname + ".rsc"), this.parse(vars));
    }

}