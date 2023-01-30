interface ProgressBarProps {
  progress: number;
}

function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <div
        role="progressbar"
        aria-label="Progesso de habitos completos nesse dia"
        className="h-3 rounded-xl bg-violet-600 transition-all"
        style={{ width: `${props.progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
