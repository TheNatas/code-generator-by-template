const fs = require("fs");
const path = require("path");

const distPath = path.resolve(process.cwd(), "dist"); // Replace "dist" with your output directory
const files = fs.readdirSync(distPath);

files.forEach((file) => {
    const filePath = path.join(distPath, file);

    if (file.endsWith(".js")) {
        const content = fs.readFileSync(filePath, "utf8");
        if (!content.startsWith("#!/usr/bin/env node")) {
            fs.writeFileSync(filePath, `#!/usr/bin/env node\n${content}`);
            console.log(`Added shebang to: ${file}`);
        }
    }
});
