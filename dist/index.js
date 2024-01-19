// src/index.js
import root from "app-root-path";

// src/RSCX.js
import fse from "fs-extra";
import path from "path";
var RSCX = class {
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
      pathname: { enumerable, value: pathname },
      dirname: { enumerable, value: parsed.dir },
      filename: { enumerable, value: parsed.name },
      extension: { enumerable, value: parsed.ext }
    });
  }
  msg(msg, detail) {
    return `File ${this.pathname}: ${msg}` + (!detail ? "" : `
${detail}`);
  }
  read() {
    try {
      return fse.readFileSync(this.pathname, "utf8");
    } catch (err) {
      throw new Error(this.msg("read failed", err.message));
    }
  }
  parseJSON(json) {
    if (!json) {
      return {};
    }
    try {
      return JSON.parse(json);
    } catch (err) {
      throw new Error(this.msg("json malformated", json));
    }
  }
  injectVars(regex, raw, vars = {}) {
    return raw.replace(regex, (match, v) => {
      if (vars.hasOwnProperty(v)) {
        return vars[v];
      }
      throw new Error(this.msg("missing variable", v));
    });
  }
  resolveLinks(regex, raw, vars = {}, escape = false) {
    return raw.replace(regex, (match, pathname, json) => {
      const raw2 = RSCX.create(this.dirname + "/" + pathname).parse({ ...vars, ...this.parseJSON(json) });
      return escape ? RSCX.escapeScript(raw2) : raw2;
    });
  }
  parse(vars = {}) {
    let raw = this.read();
    raw = this.injectVars(/\${([^}]+)}/g, raw, vars);
    raw = this.resolveLinks(/%%([^%\s]+)(?:\s+({.*}))?%%/g, raw, vars, false);
    return this.resolveLinks(/##([^#\s]+)(?:\s+({.*}))?##/g, raw, vars, true);
  }
  export(pathname, vars = {}) {
    return fse.outputFileSync(path.normalize(pathname + ".rsc"), this.parse(vars));
  }
};

// src/index.js
import chokidar from "chokidar";
var RSCbuild = ({ live, version, entries, srcDir = "src", distDir = "dist" }) => {
  srcDir = root.path + "/" + srcDir;
  distDir = root.path + "/" + distDir;
  const build = (_) => {
    console.log(`${new Date().toLocaleTimeString()} - RSC rebuild`);
    entries.forEach((pathname) => {
      const file = RSCX.create(srcDir + "/" + pathname);
      try {
        file.export(distDir + "/" + file.filename + " " + version, { version });
      } catch (err) {
        console.warn(err.message);
      }
    });
  };
  if (!live) {
    return build();
  }
  let _int;
  chokidar.watch(srcDir).on("all", (_) => {
    clearTimeout(_int);
    _int = setTimeout(build, 500);
  });
};
var src_default = RSCbuild;
export {
  RSCbuild,
  src_default as default
};
//# sourceMappingURL=index.js.map
