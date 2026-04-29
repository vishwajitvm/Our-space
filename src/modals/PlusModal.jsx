import { CalendarClock, EyeOff, ImagePlus, ListChecks } from "lucide-react";
import ActionButton from "../components/ui/ActionButton.jsx";
import ModalShell from "../components/ui/ModalShell.jsx";

export default function PlusModal({ open, onClose, onPick }) {
  const options = [
    { key: "image", label: "Upload image", icon: ImagePlus },
    { key: "poll", label: "Create poll", icon: ListChecks },
    { key: "hidden", label: "Hidden message", icon: EyeOff },
    { key: "scheduled", label: "Scheduled message", icon: CalendarClock },
  ];

  return (
    <ModalShell open={open} onClose={onClose} title="Send something softer">
      <div className="grid gap-3">
        {options.map((option) => (
          <ActionButton
            key={option.key}
            tone="soft"
            icon={option.icon}
            className="justify-start"
            onClick={() => {
              onPick(option.key);
              onClose();
            }}
          >
            {option.label}
          </ActionButton>
        ))}
      </div>
    </ModalShell>
  );
}
