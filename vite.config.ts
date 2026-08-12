import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// removed lovable-tagger import

const GPT_ENGINEER_TAG = `    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
`;

function stripGptEngineerScriptForPreview() {
  return {
    name: "strip-gptengineer-script-for-preview",
    transformIndexHtml(html: string) {
      if (process.env.STRIP_GPTENGINEER_SCRIPT !== "1") {
        return html;
      }

      return html.replace(GPT_ENGINEER_TAG, "");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    stripGptEngineerScriptForPreview(),
    react(),
    // removed componentTagger
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
