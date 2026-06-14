type IconProps = {
  className?: string;
};

export function MailIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.2 4.6 10 8.7 8.8 10c.8 1.7 2.2 3.1 4.1 4.2l1.4-1.2 4.1 1.8-.7 3.5c-.2.8-.9 1.3-1.7 1.2C9.6 18.8 5.1 14.3 4.5 8c-.1-.8.4-1.5 1.2-1.7l2.5-.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocationIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LinkedInIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 9h3v10H5V9Z" fill="currentColor" />
      <path d="M6.5 7.6a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" fill="currentColor" />
      <path
        d="M10.3 9h2.9v1.4c.6-.9 1.6-1.7 3.2-1.7 2.4 0 4.1 1.6 4.1 4.9V19h-3v-5c0-1.6-.7-2.4-1.9-2.4-1.3 0-2.1.9-2.1 2.4v5h-3.2V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BriefcaseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 8h16v11H4V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 12.5h16" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function DocumentIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 12h5M9.5 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ProfileIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c.8-3.4 3.3-5.2 7-5.2s6.2 1.8 7 5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProjectsIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h7v6H4V5ZM13 5h7v6h-7V5ZM4 13h7v6H4v-6ZM13 13h7v6h-7v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7.5 8h.01M16.5 8h.01M7.5 16h.01M16.5 16h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function ContactIcon({ className = "size-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6h14v11H8l-3 3V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 10h7M8.5 13h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
