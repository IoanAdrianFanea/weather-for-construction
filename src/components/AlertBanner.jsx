/**
 * AlertBanner.jsx
 * Used for high-severity warnings
 * type: 'none' | 'warning' | 'danger'
 */
export const AlertBanner = ({ title, message, type = 'none' }) => {
  const isNone = type === 'none';
  const isDanger = type === 'danger';

  const containerStyles = isNone
    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
    : isDanger
      ? 'bg-red-500 text-white animate-pulse'
      : 'bg-amber-400 text-slate-900 animate-pulse';

  const iconColor = isNone ? 'currentColor' : 'currentColor';

  return (
    <div className={`${containerStyles} px-6 py-4 flex items-center gap-4 mb-6 rounded-xl mx-4 shadow-sm`}>
      {isNone ? (
        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-7 h-7 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      <div>
        <h3 className="font-black text-sm uppercase tracking-wider">{title}</h3>
        {message && <p className={`text-xs mt-0.5 ${isNone ? '' : 'opacity-80'}`}>{message}</p>}
      </div>
    </div>
  );
};