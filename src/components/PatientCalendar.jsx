// PatientCalendar.jsx
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

export default function PatientCalendar({ patientId, records }) {
  const seenDates = Object.keys(records).filter(
    (date) => records[date]?.[patientId]?.checked
  );

  const seenModifiers = seenDates.map((date) => new Date(date));

  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <p className="text-sm font-medium text-gray-700 mb-2">Historial de atención</p>
      <DayPicker
            mode="single"
            selected={new Date()}
            showOutsideDays
            modifiers={{ seen: seenModifiers }}
            modifiersClassNames={{
                seen: "bg-green-500 text-white font-bold"
            }}
            className="text-sm"
            captionLayout="dropdown"
            startMonth={new Date(2024, 0)}
        />

    </div>
  );
}
