/**
 * AlertBanner.jsx
 * Used for high-severity warnings
 */
export const AlertBanner = ({ title, message, type = 'warning' }) => {
  const styles = type === 'warning' ? 'bg-amber-400 text-slate-900' : 'bg-red-500 text-white';
  return (
    <div className={`${styles} px-6 py-4 flex items-center gap-4 mb-6 shadow-md animate-pulse`}>
      <svg className="w-8 h-8 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <div>
        <h3 className="font-black text-sm uppercase tracking-wider">{title}</h3>
      </div>
    </div>
  );
};