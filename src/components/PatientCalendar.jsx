// PatientCalendar.jsx
import { useState, useMemo } from 'react';
import {
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  getDaysInMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';

export default function PatientCalendar({ patientId, records }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const seenDates = useMemo(
    () =>
      Object.keys(records)
        .filter((date) => records[date]?.[patientId]?.checked)
        .map((date) => new Date(date)),
    [records, patientId]
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(firstDay);
  const startWeekDay = (firstDay.getDay() + 6) % 7;

  const days = [];
  const prevMonthDays = getDaysInMonth(new Date(year, month - 1));

  // Días del mes anterior
  for (let i = startWeekDay - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }

  // Días del mes actual
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  // Días del mes siguiente
  const remaining = days.length % 7;
  const extraDays = remaining === 0 ? 0 : 7 - remaining;
  for (let i = 1; i <= extraDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="p-6 w-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="uppercase py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm">
        {days.map((date, idx) => {
          const isSeen = seenDates.some((d) => isSameDay(d, date));
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          let baseClasses =
            'aspect-square flex items-center justify-center text-sm border-r border-b';
          let textColor = isCurrentMonth ? 'text-gray-900' : 'text-gray-300';
          let highlight = isSeen
            ? 'bg-gray-900 text-white font-semibold'
            : 'hover:bg-gray-100';

          // Bordes redondeados solo para las 4 esquinas
          const total = days.length;
          const isTopLeft = idx === 0;
          const isTopRight = idx === 6;
          const isBottomLeft = idx === total - 7;
          const isBottomRight = idx === total - 1;

          let rounded = '';
          if (isTopLeft) rounded = 'rounded-tl-xl';
          if (isTopRight) rounded = 'rounded-tr-xl';
          if (isBottomLeft) rounded = 'rounded-bl-xl';
          if (isBottomRight) rounded = 'rounded-br-xl';

          return (
            <div
              key={idx}
              className={`${baseClasses} ${textColor} ${highlight} ${rounded}`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
