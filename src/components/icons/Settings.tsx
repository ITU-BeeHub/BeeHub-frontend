import { SVGProps } from "react";

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m19.85 8.75l4.15.83v4.84l-4.15.83l2.35 3.52l-3.43 3.43l-3.52-2.35l-.83 4.15H9.58l-.83-4.15l-3.52 2.35l-3.43-3.43l2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23L5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15l3.52-2.35l3.43 3.43zm-1.57 5.07l4-.81v-2l-4-.81l-.54-1.3l2.29-3.43l-1.43-1.43l-3.43 2.29l-1.3-.54l-.81-4h-2l-.81 4l-1.3.54l-3.43-2.29l-1.43 1.43L6.38 8.9l-.54 1.3l-4 .81v2l4 .81l.54 1.3l-2.29 3.43l1.43 1.43l3.43-2.29l1.3.54l.81 4h2l.81-4l1.3-.54l3.43 2.29l1.43-1.43l-2.29-3.43zm-8.186-4.672A3.43 3.43 0 0 1 12 8.57A3.44 3.44 0 0 1 15.43 12a3.43 3.43 0 1 1-5.336-2.852m.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0 0 13.71 12a1.71 1.71 0 1 0-2.66 1.422"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
export default SettingsIcon;
