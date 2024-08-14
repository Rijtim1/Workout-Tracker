import Link from 'next/link';
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-full w-14 flex-col border-r bg-background sm:w-60">
      <div className="flex h-14 items-center justify-between border-b px-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold sm:block">
            Fitness Tracker
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 sm:px-6">
        <ul className="grid gap-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
              prefetch={false}
            >
              <HomeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Overview</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              <TargetIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Goal Management</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/workouts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              prefetch={false}
            >
              <ClipboardListIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Browse Workouts</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function ClipboardListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function TargetIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
