// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import React from 'react'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// const Datepicker = ({label, value, onChange,minDate}) => {
//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//                 className='w-full'
//                 label={label}
//                 // disabled={minDate}
//                 minDate={dayjs(minDate) || dayjs(new Date("1970-01-01"))}
//                 value={dayjs(value)}
//                 onChange={onChange}
//                 textField={(params) => <TextField {...params} />}
//             />
//         </LocalizationProvider>
//     )
// }

// export default Datepicker

import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Datepicker = ({ label, value, onChange, minDate ,Disabled}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                className="w-full"
                label={label}
                minDate={minDate ? dayjs(minDate) : dayjs('1970-01-01')}
                disabled={minDate && Disabled}
                value={value ? dayjs(value) : null}
                onChange={onChange}
                textField={(params) => <TextField {...params} fullWidth />}
            />
        </LocalizationProvider>
    );
};

export default Datepicker;
