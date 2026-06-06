import { FiX } from "react-icons/fi";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
};

export function Modal({ open, onClose, children, panelClassName = "" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto px-4 py-6">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal content */}
      <div
        className="relative z-10 mx-auto flex min-h-full items-center justify-center"
        onClick={onClose}
      >
        <div
          className={`relative max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-lg ${panelClassName}`}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}
