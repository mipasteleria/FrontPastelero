import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos del calendario si no lo has hecho ya

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("09:00");

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const [hours, minutes] = selectedTime.split(':').map(Number);
    if ((hours >= 9 && hours < 17) || (hours === 17 && minutes === 0)) {
      setTime(selectedTime);
    } else {
      alert('Selecciona un horario entre 09:00 am y 5:00 pm');
    }
  };

  return (
    <div className="flex flex-col items-center m-6 p-6 bg-white rounded-lg shadow-md">
      <Calendar
        onChange={setDate}
        value={date}
        className="mb-6 custom-calendar"
      />
      <form className="w-full max-w-xs">
        <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Selecciona un horario valido:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 end-0 top-0 flex items-center pr-3.5 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="time"
            id="time"
            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-300 dark:focus:border-red-400"
            min="09:00"
            max="17:00"
            value={time}
            onChange={handleTimeChange}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default MyCalendar;
