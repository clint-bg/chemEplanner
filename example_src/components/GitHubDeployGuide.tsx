import React from 'react';
import { X, Github, Terminal, CheckCircle2, Globe, ExternalLink } from 'lucide-react';

interface GitHubDeployGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployGuide: React.FC<GitHubDeployGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-byu-navy text-white rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <Github className="h-6 w-6 text-byu-tan" />
            <h3 className="text-lg font-bold">Deploying to GitHub Pages</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-blue-900">
            <Globe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">100% Static & Client-Side Ready</span>
              <span className="text-xs text-blue-800">
                This simulator runs completely in the browser with zero server backend. You can upload this codebase to any public GitHub repository and serve it for free via GitHub Pages.
              </span>
            </div>
          </div>

          {/* Step 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="bg-byu-navy text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">1</span>
              <span>Push Codebase to a GitHub Repository</span>
            </h4>
            <p className="text-xs text-slate-600">
              Run these commands in your project directory:
            </p>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-lg overflow-x-auto space-y-1">
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m "Initial commit of BYU ChE Graduation Simulator"</div>
              <div>git branch -M main</div>
              <div>git remote add origin https://github.com/YOUR_USERNAME/byu-cheme-simulator.git</div>
              <div>git push -u origin main</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="bg-byu-navy text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">2</span>
              <span>Option A: One-Command Deployment via `gh-pages`</span>
            </h4>
            <p className="text-xs text-slate-600">
              Run the pre-configured deployment command:
            </p>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3.5 rounded-lg overflow-x-auto">
              <div>npm run deploy</div>
            </div>
            <p className="text-xs text-slate-500">
              This builds the Vite static assets and pushes them directly to the <code>gh-pages</code> branch.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="bg-byu-navy text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center">3</span>
              <span>Option B: Automated GitHub Actions</span>
            </h4>
            <p className="text-xs text-slate-600">
              In your GitHub Repository settings:
            </p>
            <ol className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-2">
              <li>Navigate to <strong>Settings $\rightarrow$ Pages</strong>.</li>
              <li>Under <strong>Source</strong>, select <strong>Deploy from a branch</strong> (choose <code>gh-pages</code> or <code>main / dist</code>).</li>
              <li>Save settings. Your site will be live at: <code>https://YOUR_USERNAME.github.io/byu-cheme-simulator/</code></li>
            </ol>
          </div>

          {/* Footer Close */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-byu-navy hover:bg-byu-royal text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
