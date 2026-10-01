const { useState, useEffect, useRef, useCallback } = React;

// ─── SVG Icon Components ───────────────────────────────────────────────────
const IconShield  = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconAlert   = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const IconCheck   = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
const IconChart   = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
const IconInfo    = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const IconSend    = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const IconLoader  = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const IconGraph   = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 17V9"/><path d="M12 17V7"/><path d="M17 17v-5"/></svg>;
const IconCpu     = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/><path d="M9 2v2"/><path d="M9 20v2"/><path d="M2 9h2"/><path d="M20 9h2"/></svg>;

// ─── Chart wrapper using Chart.js via canvas ref ───────────────────────────
const BarChart = ({ labels, datasets, title }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        if (chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 900, easing: 'easeInOutQuart' },
                plugins: {
                    title: { display: !!title, text: title, color: '#94a3b8', font: { size: 13, weight: '600' } },
                    legend: { labels: { color: '#94a3b8', boxWidth: 14, font: { size: 12 } } },
                    tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 }
                },
                scales: {
                    x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: '#1e293b' } },
                    y: { ticks: { color: '#64748b', callback: v => (v * 100).toFixed(0) + '%' }, grid: { color: '#1e293b' }, min: 0, max: 1 }
                }
            }
        });
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [labels, datasets]);
    return <canvas ref={canvasRef} />;
};

const LineChart = ({ datasets, title, xLabel, yLabel }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        if (chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1200, easing: 'easeInOutQuart' },
                plugins: {
                    title: { display: !!title, text: title, color: '#94a3b8', font: { size: 13, weight: '600' } },
                    legend: { labels: { color: '#94a3b8', boxWidth: 14, pointStyle: 'line', usePointStyle: true, font: { size: 11 } } },
                    tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 }
                },
                scales: {
                    x: { type: 'linear', title: { display: true, text: xLabel || '', color: '#64748b' }, ticks: { color: '#64748b', callback: v => v.toFixed(1) }, grid: { color: '#1e293b' }, min: 0, max: 1 },
                    y: { title: { display: true, text: yLabel || '', color: '#64748b' }, ticks: { color: '#64748b', callback: v => v.toFixed(1) }, grid: { color: '#1e293b' }, min: 0, max: 1 }
                }
            }
        });
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [datasets]);
    return <canvas ref={canvasRef} />;
};

const RadarChart = ({ labels, datasets }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        if (chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(canvasRef.current, {
            type: 'radar',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000 },
                plugins: {
                    legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
                    tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 }
                },
                scales: {
                    r: {
                        min: 0, max: 1,
                        ticks: { color: '#64748b', backdropColor: 'transparent', callback: v => (v * 100).toFixed(0) + '%', stepSize: 0.25 },
                        grid: { color: '#334155' },
                        pointLabels: { color: '#94a3b8', font: { size: 11 } },
                        angleLines: { color: '#334155' }
                    }
                }
            }
        });
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [labels, datasets]);
    return <canvas ref={canvasRef} />;
};

// ─── Animated Methodology Diagram ─────────────────────────────────────────
const MethodologyDiagram = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { id: 0, label: 'Raw SMS Input',        sub: 'Bangla Unicode Text',              color: '#3b82f6', icon: '📩' },
        { id: 1, label: 'Text Preprocessing',   sub: 'Normalize · Remove Noise',         color: '#8b5cf6', icon: '🔧' },
        { id: 2, label: 'Feature Extraction',   sub: 'TF-IDF (Unigram + Bigram)',         color: '#06b6d4', icon: '🔢' },
        { id: 3, label: 'ML Classification',    sub: '5 Parallel Algorithms',             color: '#f59e0b', icon: '🧠' },
        { id: 4, label: 'Rule-Based Check',     sub: 'Regex · Bangla Patterns',           color: '#ec4899', icon: '🔍' },
        { id: 5, label: 'Verdict & Report',     sub: 'Normal · Smish · Promo',            color: '#10b981', icon: '✅' },
    ];
    useEffect(() => {
        const timer = setInterval(() => {
            setStep(s => (s + 1) % (steps.length + 1));
        }, 900);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full py-8 px-4 overflow-x-auto">
            <div className="flex items-center justify-start gap-0 min-w-max mx-auto w-fit">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        {/* Node */}
                        <div className={`flex flex-col items-center transition-all duration-500 ${step > i ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3 transition-all duration-500"
                                style={{
                                    background: step > i ? `linear-gradient(135deg, ${s.color}33, ${s.color}11)` : 'transparent',
                                    border: `2px solid ${step > i ? s.color : '#334155'}`,
                                    boxShadow: step > i ? `0 0 18px ${s.color}44` : 'none'
                                }}
                            >
                                {s.icon}
                            </div>
                            <span className="text-xs font-bold text-center text-slate-300 w-24 leading-tight">{s.label}</span>
                            <span className="text-xs text-slate-500 text-center w-24 mt-0.5 leading-tight">{s.sub}</span>
                        </div>
                        {/* Arrow */}
                        {i < steps.length - 1 && (
                            <div className={`mx-3 flex flex-col items-center transition-all duration-500 ${step > i + 1 ? 'opacity-100' : 'opacity-20'}`}>
                                <svg width="40" height="16" viewBox="0 0 40 16">
                                    <line x1="0" y1="8" x2="30" y2="8" stroke={steps[i].color} strokeWidth="2.5" strokeDasharray="4 2"/>
                                    <polygon points="30,4 40,8 30,12" fill={steps[i+1].color} />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Phase labels */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
                {[
                    { label: 'Input', color: '#3b82f6' },
                    { label: 'NLP Pipeline', color: '#8b5cf6' },
                    { label: 'ML Engine', color: '#f59e0b' },
                    { label: 'Output', color: '#10b981' }
                ].map(p => (
                    <div key={p.label} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }}></div>
                        {p.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main App ─────────────────────────────────────────────────────────────
const MODEL_COLORS = {
    logistic:      { line: 'rgb(59,130,246)',  fill: 'rgba(59,130,246,0.15)',  radar: 'rgba(59,130,246,0.6)' },
    naive_bayes:   { line: 'rgb(139,92,246)',  fill: 'rgba(139,92,246,0.15)', radar: 'rgba(139,92,246,0.6)' },
    knn:           { line: 'rgb(6,182,212)',   fill: 'rgba(6,182,212,0.15)',   radar: 'rgba(6,182,212,0.6)' },
    random_forest: { line: 'rgb(245,158,11)',  fill: 'rgba(245,158,11,0.15)', radar: 'rgba(245,158,11,0.6)' },
    decision_tree: { line: 'rgb(236,72,153)',  fill: 'rgba(236,72,153,0.15)', radar: 'rgba(236,72,153,0.6)' },
};
const MODEL_LABELS = {
    logistic: 'Logistic Regression', naive_bayes: 'Naive Bayes',
    knn: 'K-Nearest Neighbors', random_forest: 'Random Forest', decision_tree: 'Decision Tree'
};
const CLASS_COLORS = { normal: '#10b981', smish: '#ef4444', promo: '#3b82f6' };

const App = () => {
    const [activeTab, setActiveTab] = useState('detector');
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [smsText, setSmsText] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [predLoading, setPredLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedModel, setSelectedModel] = useState('logistic');
    const [rocClass, setRocClass] = useState('smish');

    const demoMessages = [
        { label: 'Normal SMS', text: 'আপনি কি আজ ক্লাসে আসবেন? আমি নোটগুলো নিয়ে আসব।' },
        { label: 'Phishing Alert', text: 'আপনার বিকাশ একাউন্ট সাময়িক ভাবে বন্ধ করা হয়েছে। সচল করতে লিংকে ক্লিক করুন: http://bit.ly/updatebd' },
        { label: 'Promo Offer', text: 'দারাজ ১০.১০ ধামাকা অফার! ১০% ক্যাশব্যাক পেতে আজই শপিং করুন দারাজ অ্যাপ থেকে। শর্ত প্রযোজ্য।' }
    ];

    useEffect(() => { fetchMetadata(); }, []);

    const fetchMetadata = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/metadata');
            if (res.ok) {
                const data = await res.json();
                setMetadata(data);
                if (data.best_model) setSelectedModel(data.best_model);
            } else { setError('Failed to load models. Please run Setup Project.bat first.'); }
        } catch { setError('Could not connect to backend.'); }
        finally { setLoading(false); }
    };

    const handlePredict = async () => {
        if (!smsText.trim()) return;
        setPredLoading(true);
        setPrediction(null);
        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: smsText, model: selectedModel })
            });
            const data = await res.json();
            if (res.ok) setPrediction(data);
            else alert(data.detail || 'Prediction failed');
        } catch { alert('Failed to connect to backend'); }
        finally { setPredLoading(false); }
    };

    // ── Detector Tab ─────────────────────────────────────────────────────
    const renderDetector = () => (
        <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
            <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <IconShield className="text-blue-400 w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Threat Analysis Engine</h2>
                </div>
                <textarea
                    className="w-full p-5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-sans text-lg mb-6 shadow-inner"
                    rows="4"
                    placeholder="Paste intercepted Bangla SMS content here for analysis..."
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                />
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-slate-400 font-medium self-center mr-1">Quick Test:</span>
                        {demoMessages.map((m, idx) => (
                            <button key={idx} onClick={() => { setSmsText(m.text); setPrediction(null); }}
                                className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all border border-slate-700 hover:border-slate-500 hover:-translate-y-0.5">
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <select className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 pr-8 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                {Object.entries(MODEL_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <button onClick={handlePredict} disabled={predLoading || !smsText.trim()}
                            className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
                            {predLoading ? <IconLoader className="w-5 h-5 animate-spin" /> : <IconSend className="w-5 h-5" />}
                            Execute Scan
                        </button>
                    </div>
                </div>
            </div>

            {prediction && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className={`relative overflow-hidden p-8 rounded-2xl shadow-2xl border ${
                        prediction.prediction === 'smish'  ? 'bg-gradient-to-br from-red-900/40 to-slate-900 border-red-500/50' :
                        prediction.prediction === 'normal' ? 'bg-gradient-to-br from-emerald-900/40 to-slate-900 border-emerald-500/50' :
                                                             'bg-gradient-to-br from-blue-900/40 to-slate-900 border-blue-500/50'}`}>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${prediction.prediction==='smish'?'text-red-400':prediction.prediction==='normal'?'text-emerald-400':'text-blue-400'}`}>Classification Result</h3>
                                <div className="flex items-center gap-3">
                                    {prediction.prediction==='smish' ? <IconAlert className="text-red-500 w-8 h-8"/> : prediction.prediction==='normal' ? <IconCheck className="text-emerald-500 w-8 h-8"/> : <IconInfo className="text-blue-500 w-8 h-8"/>}
                                    <h2 className="text-3xl font-extrabold text-white">
                                        {prediction.prediction==='smish'?'Phishing Detected':prediction.prediction==='normal'?'Safe Message':'Promotional'}
                                    </h2>
                                </div>
                            </div>
                            <div className="text-right bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Confidence</span>
                                <div className="text-3xl font-black text-white">{(prediction.confidence*100).toFixed(1)}<span className="text-lg text-slate-500">%</span></div>
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-800/50 text-sm">
                            {prediction.prediction==='smish'?'Critical Warning: This message exhibits strong malicious characteristics. Do not interact with any links or provide personal information.':prediction.prediction==='normal'?'Clear: No malicious intent or suspicious patterns detected.':'Notice: This appears to be a standard marketing or promotional broadcast.'}
                        </p>
                    </div>
                    <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl border border-slate-700/50">
                        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><IconAlert className="text-amber-400 w-5 h-5"/>Security Indicators</h3>
                        {prediction.indicators.indicators.length > 0 ? (
                            <ul className="space-y-2 mb-6">
                                {prediction.indicators.indicators.map((ind, i) => (
                                    <li key={i} className="flex items-center gap-2 text-red-300 bg-red-950/30 border border-red-900/50 px-3 py-2 rounded-lg text-sm">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>{ind}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-3 py-3 rounded-lg text-sm mb-6">
                                <IconCheck className="w-4 h-4"/>All rule-based checks passed.
                            </div>
                        )}
                        <h3 className="font-bold text-white text-sm mb-4 border-t border-slate-700 pt-4">Class Probabilities</h3>
                        <div className="space-y-4">
                            {Object.entries(prediction.probabilities).map(([cls, prob]) => (
                                <div key={cls}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="capitalize font-semibold text-slate-300">{cls}</span>
                                        <span className="font-mono font-bold text-slate-300">{(prob*100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{width:`${prob*100}%`, background: CLASS_COLORS[cls] || '#64748b'}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Dashboard/Metrics Tab ─────────────────────────────────────────────
    const renderDashboard = () => {
        if (!metadata) return null;
        const stats = metadata.dataset_stats;
        const mkeys = Object.keys(metadata.metrics);
        const mlabels = mkeys.map(k => MODEL_LABELS[k] || k);

        const barDatasets = [
            { label: 'Accuracy',  data: mkeys.map(k => metadata.metrics[k].accuracy),  backgroundColor: 'rgba(59,130,246,0.7)',  borderColor: 'rgb(59,130,246)',  borderWidth: 1.5, borderRadius: 5 },
            { label: 'Precision', data: mkeys.map(k => metadata.metrics[k].precision), backgroundColor: 'rgba(139,92,246,0.7)',  borderColor: 'rgb(139,92,246)', borderWidth: 1.5, borderRadius: 5 },
            { label: 'Recall',    data: mkeys.map(k => metadata.metrics[k].recall),    backgroundColor: 'rgba(6,182,212,0.7)',   borderColor: 'rgb(6,182,212)',  borderWidth: 1.5, borderRadius: 5 },
            { label: 'F1-Score',  data: mkeys.map(k => metadata.metrics[k].f1),        backgroundColor: 'rgba(16,185,129,0.7)',  borderColor: 'rgb(16,185,129)', borderWidth: 1.5, borderRadius: 5 },
            { label: 'ROC AUC',   data: mkeys.map(k => metadata.metrics[k].roc_auc),   backgroundColor: 'rgba(245,158,11,0.7)', borderColor: 'rgb(245,158,11)', borderWidth: 1.5, borderRadius: 5 },
        ];

        const radarDatasets = mkeys.map(k => ({
            label: MODEL_LABELS[k] || k,
            data: [metadata.metrics[k].accuracy, metadata.metrics[k].precision, metadata.metrics[k].recall, metadata.metrics[k].f1, metadata.metrics[k].roc_auc],
            backgroundColor: MODEL_COLORS[k]?.fill || 'rgba(100,100,100,0.1)',
            borderColor: MODEL_COLORS[k]?.line || '#888',
            borderWidth: 2, pointRadius: 3,
        }));

        const rocDatasets = mkeys.map(k => {
            const curve = metadata.metrics[k].roc_curve;
            const pts = curve && curve[rocClass]
                ? curve[rocClass].fpr.map((f, i) => ({ x: f, y: curve[rocClass].tpr[i] }))
                : [];
            return {
                label: MODEL_LABELS[k] || k,
                data: pts.length > 0 ? pts : [{x:0,y:0},{x:1,y:1}],
                borderColor: MODEL_COLORS[k]?.line || '#888',
                backgroundColor: 'transparent',
                borderWidth: 2.5, pointRadius: 0, tension: 0.3, fill: false
            };
        });
        // Diagonal reference line
        rocDatasets.push({ label: 'Random Classifier', data: [{x:0,y:0},{x:1,y:1}], borderColor: '#475569', borderWidth: 1.5, borderDash: [5,5], pointRadius: 0, fill: false });

        return (
            <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { title:'Total SMS',  val: stats.total_messages,     color:'text-blue-400',    bg:'bg-blue-500/10',    border:'border-blue-500/20' },
                        { title:'Safe',       val: stats.class_counts.normal, color:'text-emerald-400', bg:'bg-emerald-500/10', border:'border-emerald-500/20' },
                        { title:'Phishing',   val: stats.class_counts.smish,  color:'text-red-400',     bg:'bg-red-500/10',     border:'border-red-500/20' },
                        { title:'Promo',      val: stats.class_counts.promo,  color:'text-amber-400',   bg:'bg-amber-500/10',   border:'border-amber-500/20' },
                    ].map((item, i) => (
                        <div key={i} className={`p-6 rounded-2xl border ${item.bg} ${item.border} hover:-translate-y-1 transition-all`}>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{item.title}</div>
                            <div className={`text-4xl font-black ${item.color}`}>{(item.val||0).toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                {/* Metrics Table */}
                <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/50">
                    <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2"><IconChart className="text-blue-400 w-5 h-5"/>Full Metrics Table</h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-700">
                        <table className="w-full text-left border-collapse bg-slate-900/40 text-sm">
                            <thead>
                                <tr className="bg-slate-800/80">
                                    {['Model','Accuracy','Precision','Recall','F1-Score','ROC AUC'].map(h => (
                                        <th key={h} className="py-3 px-5 font-semibold text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {mkeys.map(k => {
                                    const m = metadata.metrics[k];
                                    const isTop = k === metadata.best_model;
                                    return (
                                        <tr key={k} className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${isTop ? 'ring-1 ring-inset ring-blue-500/30' : ''}`}>
                                            <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background: MODEL_COLORS[k]?.line}}></span>
                                                {MODEL_LABELS[k]}
                                                {isTop && <span className="text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 ml-1">Best</span>}
                                            </td>
                                            {['accuracy','precision','recall','f1','roc_auc'].map(metric => (
                                                <td key={metric} className="py-3 px-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-emerald-400">{(m[metric]*100).toFixed(1)}%</span>
                                                        <div className="w-16 bg-slate-700 rounded-full h-1.5 hidden sm:block">
                                                            <div className="h-1.5 rounded-full" style={{width:`${m[metric]*100}%`, background: MODEL_COLORS[k]?.line}}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bar + Radar Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/50">
                        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><IconGraph className="text-indigo-400 w-5 h-5"/>Grouped Metric Comparison</h3>
                        <div className="h-72">
                            <BarChart labels={mlabels.map(l => l.split(' ').map(w => w[0]).join(''))} datasets={barDatasets} />
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center">
                            {barDatasets.map(d => <div key={d.label} className="flex items-center gap-1.5 text-xs text-slate-400"><span className="inline-block w-3 h-3 rounded-sm" style={{background:d.backgroundColor}}></span>{d.label}</div>)}
                        </div>
                    </div>
                    <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/50">
                        <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><IconCpu className="text-cyan-400 w-5 h-5"/>Radar Comparison</h3>
                        <div className="h-72">
                            <RadarChart labels={['Accuracy','Precision','Recall','F1','ROC AUC']} datasets={radarDatasets} />
                        </div>
                    </div>
                </div>

                {/* ROC Curve Chart */}
                <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-slate-700/50">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2"><IconChart className="text-amber-400 w-5 h-5"/>ROC Curve — All Models</h3>
                        <div className="flex gap-2">
                            {['smish','normal','promo'].map(cls => (
                                <button key={cls} onClick={() => setRocClass(cls)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${rocClass===cls ? 'text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                    style={rocClass===cls ? {background: CLASS_COLORS[cls]} : {}}>
                                    {cls}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80">
                        <LineChart key={rocClass} datasets={rocDatasets} xLabel="False Positive Rate" yLabel="True Positive Rate" />
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                        {mkeys.map(k => (
                            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
                                <span className="inline-block w-6 h-0.5 rounded" style={{background: MODEL_COLORS[k]?.line}}></span>
                                {MODEL_LABELS[k]} (AUC={((metadata.metrics[k].roc_auc||0)*100).toFixed(1)}%)
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // ── Methodology Tab ────────────────────────────────────────────────────
    const renderInfo = () => (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-700">
                <h2 className="text-2xl font-extrabold text-white mb-1">System Methodology</h2>
                <p className="text-slate-400 text-sm mb-6">End-to-end pipeline from raw Bangla SMS to threat classification</p>
                <MethodologyDiagram />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="font-bold text-blue-400 text-base mb-4 uppercase tracking-wider">NLP Pipeline</h3>
                    <div className="space-y-3 text-sm">
                        {[
                            { step: '01', title: 'Unicode Normalization', desc: 'Standardize Bangla Unicode characters and remove zero-width joiners, diacritics, and encoding artifacts.' },
                            { step: '02', title: 'Noise Removal', desc: 'Strip punctuation, special characters, and redundant whitespace while preserving Bangla script integrity.' },
                            { step: '03', title: 'TF-IDF Vectorization', desc: 'Convert cleaned text into a high-dimensional numerical feature matrix using Unigram + Bigram TF-IDF with 5,000 max features.' },
                        ].map(p => (
                            <div key={p.step} className="flex gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                <span className="text-blue-500 font-black text-lg w-8 shrink-0">{p.step}</span>
                                <div><div className="font-semibold text-white text-sm">{p.title}</div><div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{p.desc}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="font-bold text-amber-400 text-base mb-4 uppercase tracking-wider">Classification Models</h3>
                    <div className="space-y-3">
                        {Object.entries(MODEL_LABELS).map(([k, label]) => (
                            <div key={k} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: MODEL_COLORS[k]?.line}}></div>
                                <div>
                                    <div className="font-semibold text-white text-sm">{label}</div>
                                    <div className="text-slate-500 text-xs">{
                                        k==='logistic' ? 'Linear · Fast · Interpretable' :
                                        k==='naive_bayes' ? 'Probabilistic · Bayesian Theorem' :
                                        k==='knn' ? 'Instance-based · Non-parametric' :
                                        k==='random_forest' ? 'Ensemble · 100 Decision Trees' :
                                        'Hierarchical · Rule-based Splitting'
                                    }</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50">
                <h3 className="font-bold text-emerald-400 text-base mb-4 uppercase tracking-wider">Evaluation Metrics Explained</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {[
                        { name: 'Accuracy',  formula: 'TP+TN / Total',     desc: 'Overall fraction of correct predictions across all classes.' },
                        { name: 'Precision', formula: 'TP / (TP + FP)',    desc: 'Of all messages flagged as phishing, how many were actually phishing.' },
                        { name: 'Recall',    formula: 'TP / (TP + FN)',    desc: 'Of all actual phishing messages, how many were correctly caught.' },
                        { name: 'F1-Score',  formula: '2·P·R / (P+R)',     desc: 'Harmonic mean of Precision and Recall — ideal for imbalanced data.' },
                        { name: 'ROC AUC',   formula: '∫ TPR d(FPR)',      desc: 'Area under the ROC curve. 1.0 = perfect, 0.5 = random guess.' },
                        { name: 'Confusion Matrix', formula: 'TP/FP/TN/FN grid', desc: 'Per-class breakdown of correct and incorrect classifications.' },
                    ].map(m => (
                        <div key={m.name} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <div className="font-bold text-white mb-1">{m.name}</div>
                            <code className="text-xs text-emerald-400 bg-slate-800 px-2 py-0.5 rounded font-mono">{m.formula}</code>
                            <p className="text-slate-400 text-xs mt-2 leading-relaxed">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ── Loading / Error States ─────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-5 p-10 bg-slate-900 rounded-3xl border border-slate-800">
                <IconLoader className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-slate-300 font-medium">Initializing Neural Engine...</p>
            </div>
        </div>
    );

    if (error && !metadata) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-8 rounded-3xl max-w-lg text-center shadow-2xl">
                <IconAlert className="w-14 h-14 mx-auto mb-4 text-red-500 opacity-80" />
                <h2 className="text-xl font-bold mb-2 text-white">System Initialization Failed</h2>
                <p className="text-sm mb-5 text-red-200/80">{error}</p>
                <button onClick={fetchMetadata} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">Retry</button>
            </div>
        </div>
    );

    // ── Main Layout ────────────────────────────────────────────────────────
    const tabs = [
        { id: 'detector',   label: 'Scan',    icon: IconSend },
        { id: 'dashboard',  label: 'Metrics', icon: IconChart },
        { id: 'info',       label: 'Engine',  icon: IconInfo },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans">
            <header className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-900/40">
                            <IconShield className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight">Bangla SMS Security</h1>
                            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mt-0.5">ML Threat Detection System</p>
                        </div>
                    </div>
                    <nav className="flex bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50 gap-1">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/60'}`}>
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="flex-1 w-full p-4 sm:p-8 lg:p-12 overflow-x-hidden">
                {activeTab === 'detector'  && renderDetector()}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'info'      && renderInfo()}
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
