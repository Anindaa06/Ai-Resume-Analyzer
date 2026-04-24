type LoadingSpinnerProps = {
  sizeClass?: string;
};

export default function LoadingSpinner({
  sizeClass = "h-5 w-5",
}: LoadingSpinnerProps) {
  return (
    <span
      className={`${sizeClass} inline-block animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent`}
      aria-hidden="true"
    />
  );
}
