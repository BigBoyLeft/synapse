import * as esbuild from "esbuild";
import path from "path";
import fs from "fs-extra";

const fileloc = (options) => ({
  name: "fileloc",
  setup(build) {
    const rootDir = options?.rootDir ?? process.cwd();

    build.onLoad(
      { filter: /.\.(js|ts|jsx|tsx)$/, namespace: "file" },
      async (args) => {
        const isWindows = /^win/.test(process.platform);
        const esc = (p) => (isWindows ? p.replace(/\\/g, "/") : p);
        const variables = `
          const __fileloc = {
            filename: "${esc(args.path)}",
            dirname: "${esc(path.dirname(args.path))}",
            relativefilename: "${esc(path.relative(rootDir, args.path))}",
            relativedirname: "${esc(
              path.relative(rootDir, path.dirname(args.path))
            )}"
          };
          let __line = 0;
        `;
        const fileContent = new TextDecoder().decode(
          await fs.readFile(args.path)
        );

        const lines = fileContent.split("\n");
        let fileWithCharsAndLines = "";

        for (let i = 0; i < lines.length; i++) {
          const hasLineNumber = !!lines[i].match(/__line/g);
          fileWithCharsAndLines +=
            (hasLineNumber ? `__line=${i + 1};` : "") + lines[i] + "\n";
        }

        const globalsRegex =
          /__(?=(filename|dirname|relativefilename|relativedirname))/g;
        const contents =
          (fileWithCharsAndLines.match(globalsRegex) ? variables : "") +
          "\n" +
          fileWithCharsAndLines.replace(globalsRegex, "__fileloc.");
        const loader = args.path.split(".").pop();

        return {
          contents,
          loader,
        };
      }
    );
  },
});

const RESOURCE_NAME = path.basename(process.cwd());
const BUILD_WATCH = process.argv.includes("-w");
const BUILD_PATH = `../../server/resources/[framework]/${RESOURCE_NAME}`;
const BUILD_BASE = {
  bundle: true,
  charset: "utf8",
  minifyWhitespace: true,
  minifyWhitespace: true,
  absWorkingDir: process.cwd(),
};
const BUILD_ENTRIES = [
  {
    entryPoints: ["./src/server/index.ts"],
    target: "node16",
    platform: "node",
    outfile: path.join(BUILD_PATH, "server.js"),
    plugins: [fileloc()],
  },
  {
    entryPoints: ["./src/client/index.ts"],
    target: "es2020",
    outfile: path.join(BUILD_PATH, "client.js"),
  },
];

const build = async () => {
  await fs.rm(BUILD_PATH, { recursive: true, force: true });

  try {
    for (const entry of BUILD_ENTRIES) {
      const options = { ...BUILD_BASE, ...entry };

      if (BUILD_WATCH) {
        const ctx = await esbuild.context(options);
        await ctx.watch();
      }

      await esbuild.build(options);

      console.log(`Built ${options.outfile}`);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  if (await fs.pathExists(path.join(process.cwd(), "fxmanifest.lua"))) {
    await fs.copy(
      path.join(process.cwd(), "fxmanifest.lua"),
      path.join(BUILD_PATH, "fxmanifest.lua")
    );
  }

  if (await fs.pathExists(path.join(process.cwd(), "other"))) {
    await fs.copy(path.join(process.cwd(), "other"), BUILD_PATH);
  }
};

build();
