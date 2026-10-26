const fs = require("node:fs");
const path = require("node:path");
const liveServer = require("live-server");

const root = process.cwd();
const chapterPattern = /^chapter/i;
const examplePattern = /^example/i;

function findJavaScriptFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findJavaScriptFiles(entryPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".js")) {
      files.push(entryPath);
    }
  }

  return files;
}

function collectExamples(chapterDirectory) {
  return fs
    .readdirSync(chapterDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && examplePattern.test(entry.name))
    .map((entry) => {
      const exampleDirectory = path.join(chapterDirectory, entry.name);
      const files = findJavaScriptFiles(exampleDirectory).sort();
      const sketches = files.filter((file) =>
        file.toLowerCase().endsWith("sketch.js"),
      );
      const defaultSketch = sketches.find(
        (sketch) => path.basename(sketch).toLowerCase() === "sketch.js",
      );
      const selectedSketch = defaultSketch || sketches[0];
      const relativePath = (file) =>
        path.relative(root, file).split(path.sep).join("/");

      return {
        name: entry.name,
        path: path.relative(root, exampleDirectory).split(path.sep).join("/"),
        sketch: selectedSketch ? relativePath(selectedSketch) : null,
        scripts: selectedSketch
          ? files
              .filter((file) => file !== selectedSketch)
              .map(relativePath)
          : [],
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path, "pt-BR", { numeric: true }));
}

function chapterCatalog(req, res, next) {
  if (req.url.split("?")[0] !== "/api/chapters") return next();
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  try {
    const chapters = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && chapterPattern.test(entry.name))
      .map((entry) => {
        const directory = path.join(root, entry.name);
        const examples = collectExamples(directory);

        return { name: entry.name, examples };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { numeric: true }));

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(chapters));
  } catch (error) {
    console.error("Não foi possível listar os capítulos e exemplos:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Falha ao ler as pastas do projeto." }));
  }
}

liveServer.start({
  host: "0.0.0.0",
  port: 8080,
  root,
  noBrowser: true,
  middleware: [chapterCatalog],
});
