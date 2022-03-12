import esbuild from "esbuild";
// Automatically exclude all node_modules from the bundled version
import nodeExternalsPlugin from "esbuild-node-externals";

// const config = async () => {
// 	try {
esbuild
	.build({
		entryPoints: ["./src/server.ts"],
		outfile: "dist/server.js",
		bundle: true,
		minify: true,
		platform: "node",
		sourcemap: true,
		target: "node16",
		plugins: [nodeExternalsPlugin({ packagePath: "./package.json" })],
	})
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	.catch((err) => console.log({ err }));
// };

// void config();
