
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProjectData, AnalysisResult, ViewState } from './types';
import { analyzeProject } from './services/geminiService';
import { MarkdownRenderer } from './components/MarkdownRenderer';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    timeline: '',
    budget: '',
    initialRequirements: '',
    constraints: ''
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewState(ViewState.ANALYZING);
    setError(null);
    try {
      const analysis = await analyzeProject(projectData);
      setResult(analysis);
      setViewState(ViewState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
      setViewState(ViewState.ERROR);
    }
  };

  const handleReset = () => {
    setViewState(ViewState.IDLE);
    setResult(null);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {viewState === ViewState.IDLE || viewState === ViewState.ANALYZING || viewState === ViewState.ERROR ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Intake</h2>
              <p className="text-slate-500">Provide the foundational project details for PMBOK® 8 Alignment Analysis.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
                  <input
                    required
                    name="name"
                    value={projectData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Student Wellness Portal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Timeline</label>
                  <input
                    required
                    name="timeline"
                    value={projectData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. 16 weeks, Oct-Feb"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Project Description</label>
                <textarea
                  required
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="What is the outcome or value delivery intended?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Budget/Resources</label>
                  <input
                    name="budget"
                    value={projectData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. $5,000 or 'Internal Labor Only'"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Constraints & Assumptions</label>
                  <input
                    name="constraints"
                    value={projectData.constraints}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Must use university servers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Initial High-Level Requirements</label>
                <textarea
                  required
                  name="initialRequirements"
                  value={projectData.initialRequirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="List 3-5 core functional or business requirements..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={viewState === ViewState.ANALYZING}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                    viewState === ViewState.ANALYZING 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-95'
                  }`}
                >
                  {viewState === ViewState.ANALYZING ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Analyzing Performance Domains...
                    </span>
                  ) : 'Generate PMBOK 8 Analysis'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{projectData.name}</h2>
                <p className="text-slate-500">Analysis Result: Planning Performance Domain (Focus Area 2.1 & 2.2)</p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-semibold"
              >
                New Analysis
              </button>
            </div>

            {/* AI ADVISORY WARNINGS - CRITICAL COMPONENT */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h3 className="text-xl font-bold text-amber-900">AI Advisory Warnings</h3>
              </div>
              <MarkdownRenderer content={result?.advisoryWarnings || ''} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Scope Management Plan */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">2.1 Plan Scope Management</h3>
                </div>
                <MarkdownRenderer content={result?.scopePlan || ''} />
              </div>

              {/* Requirements Traceability Matrix */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">2.2 Elicit & Analyze Requirements</h3>
                </div>
                <MarkdownRenderer content={result?.requirementsMatrix || ''} />
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-slate-900 text-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-xl font-bold">PM Gap & Risk Analysis</h3>
              </div>
              <div className="text-slate-300">
                <MarkdownRenderer content={result?.gapAnalysis || ''} />
              </div>
              <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500 italic">
                Disclaimer: This output is for educational purposes only and follows PMBOK® 8 methodologies. No professional guarantees are provided. Final decisions rest with the project manager.
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
