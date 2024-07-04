import { useState } from 'react';
import Calendar from 'react-calendar';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex justify-center items-center m-6">
      <Calendar
        onChange={setDate}
        value={date}
        className="custom-calendar"
      />
    </div>
  );
};

export default MyCalendar;
