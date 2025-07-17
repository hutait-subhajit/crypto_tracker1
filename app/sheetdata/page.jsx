"use client";
import React, { useState, useEffect } from "react";
import Datepicker from "@/components/Datepicker";
import { pdf } from '@react-pdf/renderer';
import MyPDFDocument from "@/components/MyPDFDocument";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from 'xlsx';

//import icons
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegFileExcel } from "react-icons/fa6";

function Page() {
    const [data, setData] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [selectType, setSelectType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showdata, setShowdata] = useState(false);

    // const SHEETDB_URL = "https://sheetdb.io/api/v1/hgwp94m2vi6s4";
    const SHEETDB_URL = "https://sheetdb.io/api/v1/4py4qynym7a7f";

    // Convert dd/mm/yyyy to Date object
    const parseDate = (str) => {
        const [day, month, year] = str.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    // Convert Date object to dd/mm/yyyy
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return new Date(`${year}-${month}-${day}`);
    };

    // Fetch all data once
    useEffect(() => {
        fetch(SHEETDB_URL)
            .then((res) => res.json())
            .then((json) => {
                setData(json);
            })
            .catch((err) => console.error("Failed to fetch:", err));
    }, []);


    const handleSearch = () => {
        if (!selectType && !startDate && !endDate) {
            toast.error(`Please select payment type,start Date and end date`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return
        }
        if (!selectType) {
            toast.error('Please select payment type', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return
        }
        if (!startDate) {
            toast.error('Please select payment type', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return
        }
        if (!endDate) {
            toast.error('Please select payment type', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return
        }
        let start = formatDate(startDate?.$d);
        let end = formatDate(endDate?.$d);
        let filtered = data.filter((item) => {
            const date = parseDate(selectType == "UP" ?item["Planned Payment Date"] : item["Actual Payment Date"]);
            // console.log(date)
            return date >= start && date <= end;
        });
        setFiltered(filtered);
        setShowdata(true);
    }
    console.log(filtered)
    const handleDownload = async () => {
        if (!filtered.length) {
            alert("No data to download");
            return
        };
        const blob = await pdf(<MyPDFDocument data={filtered} selectType={selectType} totalSum={totalSum} />).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    function totalSum(param){
        const total = filtered.reduce((total, item) => {
            const amount = parseFloat(item[param].replace(/[^0-9.]/g, ''));
            return total + amount;
        }, 0);
        return `₹${total.toFixed(2)}`
    }

    const handleDownloadExcel = () => {
        if (!filtered.length) {
            alert("No data to download");
            return;
        }

        // Prepare data for Excel
        const excelData = filtered.map(row => ({
            "Project Name": row["Project Name"],
            "Milestone Name": row["Milestone Name"],
            "Expected Amount": row["Expected Amount"],
            // [selectType === "UP" ? "Expected Amount" : "Paid Amount"]: selectType === "UP" ? row["Expected Amount"] : row["Paid Amount"],
            [selectType === "CP" && "Paid Amount"]: selectType === "CP" && row["Paid Amount"],
            "Payment Status": row["Payment Status"],
            "Remarks": row["Remarks"] || "-"
        }));
        
        //to Show Total
        const totalRow = {
            "Project Name": "Total",
            "Milestone Name": "",
            "Expected Amount": totalSum("Expected Amount"),
            [selectType === "CP" && "Paid Amount"]: selectType === "CP" && totalSum("Paid Amount"),
            "Payment Status": "",
            "Remarks": ""
        };
        excelData.push(totalRow);
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "filtered-data.xlsx");
    };


    const handleChange = (event) => {
        event.preventDefault();
        setSelectType(event.target.value);
    };
    

    const formatter = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        return `${day} - ${month} - ${year}`;
    };
    return (
        <div
            className="w-full max-w-[640px] mx-auto bg-gray-50 min-h-[20rem] p-8 rounded-md"
        >
            <h1 className="text-2xl text-center text-blue-700">Filter Join Dates (from SheetDB)</h1>

            {/* <Box sx={{ minWidth: 120 }}> */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="demo-simple-select-label">Payment Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectType}
                    label="Payment Type"
                    onChange={handleChange}
                >
                    <MenuItem value={'UP'}>Upcomming Payment</MenuItem>
                    <MenuItem value={'CP'}>Complete Payment</MenuItem>
                </Select>
            </FormControl>
            {/* </Box> */}

            <div>
                <div className="flex gap-4  sm:justify-between flex-col sm:flex-row">
                    <div className="sm:w-1/2">
                        <Datepicker label="From" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                    </div>
                    <div className="sm:w-1/2">
                        <Datepicker label="To"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            minDate={new Date(startDate)}
                            Disabled={!startDate ? true : false}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSearch}>Search</button>
                    <ToastContainer />
                </div>
            </div>

            {/* <h2>Results ({filtered.length})</h2> */}

            {
                filtered.length > 0 && <div className="mt-2 flex gap-4 items-center">
                    <span className="text-xl font-semibold text-gray-700">Download File</span>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                    >
                        <IoCloudDownloadOutline />
                        <FaRegFilePdf />
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="px-4 py-2 bg-yellow-600 text-white rounded flex items-center gap-2"
                    >
                        <IoCloudDownloadOutline />
                        <FaRegFileExcel />
                    </button>
                </div>
            }
            {/* <div className="overflow-x-auto"> */}
            {showdata && (
                filtered.length > 0 ? (
                    <>
                        <h2 className="my-2 text-base font-semibold text-gray-700">
                            {formatter(startDate?.$d)} to {formatter(endDate?.$d)}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[740px] border border-gray-300 rounded-lg text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-600 text-white">
                                        <th className="px-3 py-2">Project Name</th>
                                        <th className="px-3 py-2">MileStone Name</th>
                                        <th className="px-3 py-2">Expected Amount</th>
                                        {selectType == "CP" && <th className="px-3 py-2">Paid Amount</th>}
                                        <th className="px-3 py-2">Payment Status</th>
                                        <th className="px-3 py-2 w-[200px]">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((row, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                            <td className="px-3 py-2">{row["Project Name"]}</td>
                                            <td className="px-3 py-2">{row["Milestone Name"]}</td>
                                            <td className="px-3 py-2">{row["Expected Amount"]}</td>
                                            {selectType === "CP" && <td className="px-3 py-2">{row["Paid Amount"]}</td>}
                                            <td className="px-3 py-2">{row["Payment Status"]}</td>
                                            <td className="px-3 py-2 w-[200px]">{row["Remarks"] || "-"}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={1}></td>
                                        <td colSpan={1}></td>
                                        <td className="px-3 py-2" colSpan={1}>
                                            Total ={
                                            // filtered.reduce((sum, val) => sum + parseFloat(val["Expected Amount"].replace(/[^0-9.]/g, '')), 0).toFixed(2)
                                            totalSum("Expected Amount")
                                            }
                                        </td>
                                        {
                                            selectType === "CP" && <td className="px-3 py-2" colSpan={1}>= ₹{filtered.reduce((sum, val) => sum + parseFloat(val["Paid Amount"].replace(/[^0-9.]/g, '')), 0).toFixed(2)}</td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 py-4">No data found</p>
                )
            )}
            {/* </div> */}
        </div>
    );
}

export default Page;
