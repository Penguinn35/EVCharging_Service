type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
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
          className="max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
