import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultConfig = {
  ignore: [
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    "*.log",
    "*.lock",
    ".env*",
    ".DS_Store",
    ".vscode",
    ".idea",
  ],
  maxDepth: 4,
  groupFolders: true,
  showFiles: true,
  annotations: {
    "src/components": "Components directory",
    "src/pages": "Page components",
    "src/assets": "Static assets",
    "src/hooks": "Custom Hooks",
    "src/utils": "Utility functions",
    "src/services": "API services",
    "src/stores": "State management",
    "src/types": "Type definitions",
    "src/styles": "Style files",
    "src/layouts": "Layout components",
    public: "Public assets directory",
  },
};

class ProjectStructureGenerator {
  constructor(customConfig = {}) {
    this.config = { ...defaultConfig, ...customConfig };
    this.basePath = process.cwd();
  }

  shouldIgnore(file, fullPath) {
    return this.config.ignore.some((pattern) => {
      if (pattern.includes("*")) {
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
        return regex.test(file);
      }
      return file === pattern || fullPath.includes(pattern);
    });
  }

  getRelativePath(fullPath) {
    return path.relative(this.basePath, fullPath);
  }

  getAnnotation(relativePath) {
    return this.config.annotations[relativePath];
  }

  generateStructure(dir, prefix = "", depth = 0) {
    if (depth > this.config.maxDepth) return "";

    const files = fs.readdirSync(dir);
    let structure = "";

    const items = files
      .filter((file) => !this.shouldIgnore(file, path.join(dir, file)))
      .map((file) => ({
        name: file,
        path: path.join(dir, file),
        isDirectory: fs.statSync(path.join(dir, file)).isDirectory(),
      }));

    if (this.config.groupFolders) {
      items.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
      });
    } else {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const marker = isLast ? "└── " : "├── ";
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      const relativePath = this.getRelativePath(item.path);
      const annotation = this.getAnnotation(relativePath);

      structure += `${prefix}${marker}${item.name}${
        annotation ? ` // ${annotation}` : ""
      }\n`;

      if (item.isDirectory) {
        structure += this.generateStructure(item.path, newPrefix, depth + 1);
      }
    });

    return structure;
  }

  updateReadme(structure) {
    const readmePath = path.join(this.basePath, "README.md");
    let content = fs.existsSync(readmePath)
      ? fs.readFileSync(readmePath, "utf-8")
      : "";

    const startMarker = "<!-- PROJECT_STRUCTURE_START -->";
    const endMarker = "<!-- PROJECT_STRUCTURE_END -->";
    const structureContent = `${startMarker}\n\`\`\`\n${structure}\`\`\`\n${endMarker}`;

    if (content.includes(startMarker) && content.includes(endMarker)) {
      const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, "g");
      content = content.replace(regex, structureContent);
    } else {
      content += "\n\n## Project Structure\n\n" + structureContent;
    }

    fs.writeFileSync(readmePath, content);
  }

  generate() {
    try {
      const structure = this.generateStructure(this.basePath);
      this.updateReadme(structure);
      console.log(
        "✨ Project structure has been successfully updated in README.md"
      );
    } catch (error) {
      console.error("❌ Failed to generate project structure:", error);
      process.exit(1);
    }
  }
}

const generator = new ProjectStructureGenerator();
generator.generate();

export default ProjectStructureGenerator;
