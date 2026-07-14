import { glob } from "glob";

export const loadFiles = async (dirName) => {
	return glob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
};
